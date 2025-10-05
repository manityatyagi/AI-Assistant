import { Pinecone } from '@pinecone-database/pinecone';
import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model';
import { embedText } from '../utils/embedText.js';
import mongoose from 'mongoose';
import { convertPromptToOpenAI } from '@langchain/openai';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const importJson = async (req, res, next) => {
          const session = await mongoose.startSession();
          session.startTransaction();
      try {
         const { userId } = req;
         const { file } = req;
         
         if(!file) {
           return res.status(400).json({ message: "No file uploaded" });
         }         

         let data;
         try{
              data = JSON.parse(file.buffer.toString());
         } catch (error) {
           return res.status(400).json({ message: "Invalid JSON file" });
         }
        
          if(!data.messages || Array.isArray(data.messages)) {
            return res.status(400).json({ message: "Invalid data format" });
          }

         const conversation = await Conversation.create([{
                userId,
                title: data.meta?.title || `Imported ${new Date().toLocaleDateString()}`,
                createdAt: data.meta?.createdAt || new Date()
         }], { session });
         
         const messageToInsert = [];
         const pineconeVectors = [];
         let lastUserMessage = null;
          
         for(const msg of data.messages) {
           if(!msg.content || !msg.timeStamp) {
             continue; 
           }
           if(msg.role === 'user') {
             lastUserMessage = msg.content;
           }else if(msg.role === 'assistant' && lastUserMessage) {
             messageToInsert.push({
               conversationId: conversation._id,
                content: lastUserMessage,
                userId,
                response: msg.content,
                createdAt: msg.timeStamp || new Date(),
             });

             pineconeVectors.push({
               id: `msg-${Date.now()}-${messageToInsert.length}`,
               values: await embedText(lastUserMessage),
               metadata: {
                 conversationId: conversation[0]._id,
                 userId,
                 text: lastUserMessage,
                 role: 'human',
                 timestamp: msg.timeStamp || new Date(),
               }
             });

              pineconeVectors.push({
                id: `resp-${Date.now()}-${messageToInsert.length}`,
                values: await embedText(msg.content),
                metadata: {
                  conversationId: conversation[0]._id,
                  userId,
                  text: msg.content,
                  role: 'assistant',
                  timestamp: msg.timeStamp || new Date(),
                }
              });
             messageToInsert.push({
               conversationId: conversation._id,
               content: lastUserMessage,
               response: msg.content,
               timeStamp: msg.timeStamp
             });
             lastUserMessage = null;
           }
         }
        await Message.insertMany(messageToInsert, { session });
         

        const namespace = `user_${userId}_conv_${conversation[0]._id}`;
        await pc.upsert({
          name: namespace,
          dimension: 1536,
          metric: 'cosine',
        });

        const index = pc.Index(namespace);
        await index.upsert({ pineconeVectors });

        await session.commitTransaction();

        res.status(201).json({
          id: conversation[0]._id,
          title: conversation[0].title,
          messageCount: messageToInsert.length,
        });
       } catch (error) {
         next(error);
         await session.abortTransaction();
       }finally {
         session.endSession();
       }
}

const importChatGPT = async(req, res, next) => {
        try {
          const { userId } = req;
          const { conversations } = req.body;
          if(!conversations || !Array.isArray(conversations)) {
            return res.status(400).json({ message: "Invalid conversations format" });
          }
           const results = await Promise.all(
            conversations.map(async(convo) => {
              const newConv = await Conversation.create({
                userId,
                title: convo.title || `Imported ${new Date().toLocaleDateString()}`,
              });
               const messages = await Message.insertMany(
                conv.messages.map(msg => ({
                  conversationId: newConv._id,
                  content: msg.content,
                  response: msg.response,
                  userId,
                  createdAt: msg.createdAt || new Date(),
                })) 
               );
                  return { 
                    id: newConv._id,
                    title: newConv.title,
                    messageCount: messages.length
                  };
              })
           );           
             res.status(201).json({imported: results.length, results });
        } catch (error) {
          next(error);
          res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
          });          
        }
}

const rebuildEmbeddings = async(req, res, next) => {
       try {
          const userId = req;
          const conversationId = req.params;
          const conversation = await Conversation.findOne({ _id: conversationId, userId });
          if(!conversation) {
             return res.status(404).json({
               message: "Conversation not found" 
             });
           }

           const messages = await Message.find({ conversationId });
            if(!messages || messages.length === 0) {
              return res.status(404).json({ 
                message: "No messages found in conversation" 
              });
            }

            const index = pc.index(`user_${userId}_conv_${conversationId}`);
            const vectors = [];

            for(const msg of messages) {
              vectors.push({
                id: `msg-${msg._id}`,
                values: await embedText(msg.content),
                metadata: {
                  conversationId,
                  userId,
                  text: msg.content,
                  role: 'human',
                  timestamp: msg.createdAt.getTime()
                }
              });
              vectors.push({
                id: `resp-${msg._id}`,
                values: await embedText(msg.response),
                metadata: {
                  conversationId,
                  userId,
                  text: msg.response,
                  role: 'assistant',
                  timestamp: msg.createdAt.getTime()
                }
              });
            }

            for(let i = 0; i < vectors.length; i += 100) {
              const batch = vectors.slice(i, i + 100);
              await index.upsert({ vectors: batch });
            }

            res.status(200).json({
              success: true,
              vectorsCreated: vectors.length
            });
       } catch (error) {
          next(error);
          res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
         });
       }
}

export { importJson, importChatGPT, rebuildEmbeddings };