import archiver from 'archiver';
import Readable from 'stream';
import Conversation from '../models/conversation.model';
import PDFDocument from 'pdfkit';
import Message from '../models/message.model';

const formatDate = (date) => date.toISOStrng().replace(/[:.]/g, '-');
const exportJson = async(req, res) => {
    try {
       const { userId } = req;
       const { conversationId } = req.params;

       const conversation = await Conversation.findOne({_id: conversationId, userId})
                                  .populate('messages');
        if(!conversation) {
          return res.status(404).json({
            message: "Conversation not found"
          });
        }

        const exportData = {
          meta: {
            exportedAt: new Date().toISOString(),
            conversationId: conversation._id,
            title: conversation.title || "Untitled Conversation",
            messageCount: conversation.messages.length,
          },
          messages: conversation.messages.map(msg => ({
            timeStamp: msg.timeStamp,
            role: 'user',
            content: msg.content
          })).concat(
            conversation.messages.map(msg => ({
              timeStamp: msg.createdAt,
              role: 'assistant',
              content: msg.response
            }))
          ).sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp)) 
        }
            
        const fileName = `chat-${formatDate(new Date())}-${conversation.title.slice(0,20)}.json`;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        const stream = Readable.from(JSON.stringify(exportData, null, 2));
        Readable.pipe(res);
       } catch (error) {
          next(error);
          res.status(500).json({message: "Internal server error", error: error.message});
    }
}

const exportPDF = async(req, res) => {
     try {
        const { userId } = req;
        const { conversationId } = req.params;

        const conversation = await Conversation.findOne({
          _id: conversationId,
          userId
        }).populate({
          path: 'messages',
          options: {sort: {createdAt: 1} }
        });

        if(!conversation) {
          return res.status(404).json({message: "Conversation not found"});
        }

        const doc = new PDFDocument();
        const fileName = `chat-${formatDate(new Date())}-${conversation.title.slice(0,20)}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        doc.info.Title = `Chat Export - ${conversation.title || "Untitled"}`;
        doc.info.Author = `User ${userId}`;
        doc.fontSize(20).text(conversation.title, { align: 'center' });
        doc.moveDown();

        conversation.messages.forEach((msg, i) => {
          doc.fillColor("#3498db")
             .text(`You (${msg.createdAt.toLocaleString()}):`, { continued: true })
             .fillColor("#000")
             .text(`${msg.content}`);
          doc.fillColor("#e74c3c")
             .text(`Assistant (${msg.createdAt.toLocaleString()}):`, { continued: true })
             .fillColor("#000")
             .text(`${msg.response}`);
        
        if(i < conversation.messages.length - 1) {
          doc.moveDown().moveDown();
        }
     });
        doc.pipe(res);
        doc.end();
     } catch (error) {
       next(error);
       res.status(500).json({
        message: "Internal server error", 
        error: error.message
       });
     }
}

const exportAll = async(req, res) => {
       try {
         const { userId } = req;
         
         const archive = archiver('zip', {
           zlib: { level: 9 }
         });
         const filename = `chat-export-${formatDate(new Date())}.zip`;
         res.setHeader('Content-Type', 'application/zip');  
         res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
         archive.pipe(res);
         
          const conversations = await Conversation.find({userId}).populate('messages'); 
          if(conversations.length === 0) {
            return res.status(404).json({message: "No conversations found"});
          }
          
          for(const convo of conversations) {
            messages = await Message.find({conversationId: convo._id}).sort({createdAt: 1});
           
            const Data = {
              meta: {
                title: convo.title,
                createdAt: convo.createdAt,
                updatedAt: convo.updatedAt,
              },
              messages: messages.map(msg => ({
                timeStamp: msg.createdAt,
                response: msg.response,
                content: msg.content
              }))
            };
            archive.append(JSON.stringify(Data, null, 2),
             { name: `${convo.title.replace(/[^a-z0-9]/gi, '_')}.json` 
            });
          }
          archive.finalize();
       } catch (error) {
          next(error);
          res.status(500).json({message: "Internal server error", error: error.message});
       }
}