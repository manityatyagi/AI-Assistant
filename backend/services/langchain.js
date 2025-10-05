import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { BufferMemory, VectorStoreRetrieverMemory, CombinedMemory } from 'langchain/memory';
import { PineconeStore } from '@langchain/pinecone';
import { getIndex, ensureIndex } from './pinecone.js';

let vectorStore = null;

async function getVectorStore() {
  if (vectorStore) return vectorStore;
  await ensureIndex();
  const index = getIndex();
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: process.env.GEMINI_EMBED_MODEL || 'text-embedding-004',
  });
  vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });
  return vectorStore;
}

export async function createMemory() {
  const buffer = new BufferMemory({
    returnMessages: true,
    inputKey: 'input',
    memoryKey: 'chat_history',
  });

  const store = await getVectorStore();
  const vectorMemory = new VectorStoreRetrieverMemory({
    retriever: store.asRetriever(3),
    memoryKey: 'long_term_memory',
    inputKey: 'input',
  });

  return new CombinedMemory({
    memories: [buffer, vectorMemory],
  });
}

 



