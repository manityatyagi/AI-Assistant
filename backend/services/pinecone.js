const INDEX_NAME = process.env.PINECONE_INDEX || 'assistant-vectors';
const API_KEY = process.env.PINECONE_API_KEY;

let pc = null;

async function getClient() {
  if (pc !== null) return pc;
  if (!API_KEY) {
    pc = undefined; // explicitly mark as unavailable
    return pc;
  }
  try {
    const mod = await import('@pinecone-database/pinecone');
    const Pinecone = mod.Pinecone || mod.default?.Pinecone;
    if (!Pinecone) throw new Error('Pinecone constructor not found');
    pc = new Pinecone({ apiKey: API_KEY });
    return pc;
  } catch (err) {
    console.warn('Pinecone init warning:', err.message);
    pc = undefined;
    return pc;
  }
}

export async function ensureIndex(name = INDEX_NAME, dimension = 1536) {
  const client = await getClient();
  if (!client) return; // no-op when not configured
  try {
    const indexes = await client.listIndexes();
    const indexList = Array.isArray(indexes)
      ? indexes
      : indexes?.indexes || [];
    const exists = indexList.some((i) => (typeof i === 'string' ? i === name : i.name === name));
    if (!exists) {
      await client.createIndex({ name, dimension, metric: 'cosine' });
      console.log(`Pinecone index '${name}' created`);
    }
  } catch (error) {
    console.warn('Pinecone ensureIndex warning:', error.message);
  }
}

function createIndexStub() {
  return {
    namespace() {
      return {
        async upsert() { /* no-op stub */ },
        async delete() { /* no-op stub */ },
      };
    },
  };
}

export async function getIndex(name = INDEX_NAME) {
  const client = await getClient();
  if (!client) return createIndexStub();
  // New SDK uses lower-case method
  return client.index ? client.index(name) : client.Index(name);
}

export { pc };
