import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { createMemory } from './langchain.js';

export async function getChatChain() {
  const memory = await createMemory();
  return new ConversationChain({
    llm: new ChatOpenAI({ temperature: 0.7 }),
    memory,
    verbose: true,
  });
}