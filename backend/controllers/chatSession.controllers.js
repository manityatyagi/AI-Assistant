import { v4 as uuidv4 } from 'uuid';
import { getChatChain } from '../services/chainService.js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { getIndex, ensureIndex } from '../services/pinecone.js';

const conversations = new Map();
const embeddings = new OpenAIEmbeddings();
const VECTOR_NAMESPACE = 'chat-sessions';

export const startConversation = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'anon';
    const conversationId = `conv_${uuidv4()}`;

    const chain = await getChatChain();
    conversations.set(conversationId, {
      userId,
      chain,
      createdAt: new Date(),
      messages: [],
    });

    res.status(201).json({
      conversationId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ 
      error: 'Failed to start conversation' 
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = conversations.get(id);
    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversation not found'
      });
    }

    res.status(200).json({
      id,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve conversation'
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const conversation = conversations.get(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const response = await conversation.chain.call({ input: text });
    const message = {
      id: uuidv4(),
      text,
      response: response.response,
      timestamp: new Date(),
    };
    conversation.messages.push(message);

    await ensureIndex();
    const index = getIndex();
    const vector = await embeddings.embedQuery(text);
    await index.namespace(VECTOR_NAMESPACE).upsert([
      {
        id: message.id,
        values: vector,
        metadata: {
          conversationId: id,
          text,
          isUserMessage: true,
        },
      },
    ]);

    res.json({ response: response.response, messageId: message.id });
  } catch (error) {
    console.error('Sending message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

export const endConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = conversations.get(id);
    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversation not found'
      });
    }
    try {
    const index = getIndex();
    await index.namespace(VECTOR_NAMESPACE).delete({
        filter: { conversationId: id },
    });
    } catch (e) {
      console.warn('Pinecone deletion warning:', e.message);
    }

    conversations.delete(id);
    res.status(204).json({
       message: 'Conversation ended successfully'
    });
  } catch (error) {
    console.error('Ending conversation error:', error);
    res.status(500).json({ 
      error: 'Failed to end conversation'
    });
  }
};