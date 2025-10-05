import { pc } from '../services/pinecone.js';
import { OpenAIEmbeddings } from "@langchain/openai";

const pinecone = pc;
await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENV
});

const indexName = 'chat-sessions';
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
});

const searchConversation = async(req, res) => {
    try {
        const {query, conversationId} = req.body;

        const queryEmbedding = await embeddings.embedQuery(query);
        const index = pinecone.Index(indexName);
        const results = await index.query({
            topK: 5,
            vector: queryEmbedding,
            filter: {
                userId: req.user.id,
                ...( conversationId && { conversationId })
            },
            includeMetadata: true
       });

       res.status(201).json({
        results: results.matches.map(match => ({
            text: match.metadata.text,
            conversationId: match.metadata.conversationId,
            score: match.score,
            timestamp: match.metadata.timestamp
        }))
    });
    } catch (error) {
        console.error("Searching messages error:", error);
        res.status(500).json({error: "Failed to search messages"});
    }
}

const flagImportantMessage = async(req, res) => {
    try {
        const { messageId, conversationId} = req.body;

        const index = pinecone.Index(indexName);
        await index.update({
            id: messageId,
            setMetadata: {
                important: true,
                flaggedAt: new Date().toISOString()
            },
            filter: {
                userId: req.user.id,
                conversationId
            }
        });
        
        res.status(201).json({success: true});
    } catch (error) {
        console.error("Flaging important message error:", error);
        res.status(500).json({error: "Failed to flag message"});
    }
}

const getConversationContext = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ 
                error: 'conversationId is required' 
          });
        }
 
        res.status(201).json({ 
            conversationId, 
            context: [] 
        });
    } catch (error) {
        console.error('Get conversation context error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch conversation context' 
        });
     }
};

export {flagImportantMessage, getConversationContext, searchConversation };