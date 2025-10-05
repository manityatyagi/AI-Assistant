import pkg from "@pinecone-database/pinecone";
const { PineconeClient } = pkg;  

const INDEX_NAME = process.env.PINECONE_INDEX || 'assistant-vectors';
const pc = new PineconeClient();

await pc.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENV 
});

export async function ensureIndex(name = INDEX_NAME, dimension = 1536) {
  try {
    const indexes = await pc.listIndexes();
    const exists = indexes.indexes?.some(i => i.name === name);
    if (!exists) {
      await pc.createIndex({
        name,
        dimension,
        metric: 'cosine',
      });
      console.log(`Pinecone index '${name}' created`);
    }
  } catch (error) {
    console.warn('Pinecone ensureIndex warning:', error.message);
  }
}

export function getIndex(name = INDEX_NAME) {
  return pc.Index(name); 
}

export { pc };
