import { OpenAI } from '@langchain/core/llms/openai';
import { ConversationChain } from '@langchain/core/chains';
import { BufferMemory } from '@langchain/core/memory';
import rateLimit from 'express-rate-limit';
import { error } from 'winston';
import { ResponseStream } from 'openai/lib/responses/ResponseStream.mjs';

const completionLimitor = rateLimit({
    windowMs: 60 * 1000,
    max: 25
});

const models = {
    'gpt-3.5-turbo': new OpenAI({modelName: 'gpt-3.5-turbo', temperature: 0.6 }),
    'gpt-5': new OpenAI({modelName: 'gpt-5', temperature: 0.6 })
}

let activeModelId = 'gpt-3.5-turbo';
const sessionMemories = new Map();

 const getCompletion = [completionLimitor, async(req, res) => {
        try{
             const {prompt, sessionId} = req.body;
             if(!prompt?.trim()){
                return res.status(401).json({
                   error: "Prompt is required"
              })
            }
       
            if(!sessionMemories.has(sessionId)) {
                sessionMemories.set(sessionId, new BufferMemory({
                    memoryKey: "chat_history",
                    returnMessages: true
                }));
            }
         const memory = sessionMemories.get(sessionId);
         const chain = new ConversationChain({
            llm: models[activeModelId],
            memory
          });
         const response = await chain.call({input: prompt})

          res.json({
            completion: response.response,
            model: activeModelId,
            tokenUsage: response.tokenUsage
        });
    } catch(error){
        console.error(error.message);
        res.status(500).json({
            error: "Failed to generate completion"
      });
    }
}












]

const explainCode = async(req, res) => {
    try {
        const { code, language} = req.body;
        if(!code?.trim()) {
            return res.status(400)
            .json({error: "Code is required"});
        }       

        const prompt = `Explain this ${language} code:
                        \`\`\` ${language}
                        ${code}
                        \`\`\`
                        Focus on:
                        1. Purpose of the code
                        2. Key functions/variables
                        3. Expected output
                        Use bullet points.
                        `;

        const explanation = await models[activeModelId].call(prompt);
        res.json({explanation});
    } catch (error) {
        console.error('Explain error:', error);
        res.status(500).json({error: error.message});;
    }
}

const optimizeCode = async(req, res) => {
    try {
        const {code, language} = req.body;
        if(!code?.trim()) {
          return res.status(400).json({error: "Code is required"});
        }

        const prompt = `Optimize this ${language} code:
                        \`\`\`${language}
                        ${code}
                        \`\`\`
                        Provide: 
                        1. Optimized version
                        2. Explanation of changes
                        3. Performance impact
                        Format as markdown.
                        `;

         const optimization = await models[activeModelId].call(prompt);
         res.json({optimization});               
    } catch (error) {
        logger.warn("Error in optimizing this code");
        res.status(500).json({error: error.message});
    }
} 

export { getCompletion, optimizeCode, explainCode };