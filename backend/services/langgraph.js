import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StateGraph, END } from '@langchain/langgraph';

function detectIntent(text) {
  const t = (text || '').toLowerCase();
  if (/(expense|spend|budget|income|finance)/.test(t)) return 'finance';
  if (/(schedule|calendar|meeting|remind|task|todo)/.test(t)) return 'schedule';
  if (/(health|wellness|diet|workout|sleep|steps|water)/.test(t)) return 'health';
  return 'chat';
}

async function handleFinance(input) {
  return `Finance assistant: I can track expenses, budgets, and income. Your query: "${input}"`;
}
async function handleSchedule(input) {
  return `Schedule assistant: I can add tasks, events, and reminders. Your query: "${input}"`;
}
async function handleHealth(input) {
  return `Health assistant: I can track wellness metrics and habits. Your query: "${input}"`;
}

function extractText(output) {
  if (!output) return '';
  const c = output.content;
  if (Array.isArray(c)) {
    return c.map(p => (typeof p === 'string' ? p : p?.text || '')).join('');
  }
  return typeof c === 'string' ? c : '';
}

export function buildAssistantGraph() {
  const llm = new ChatGoogleGenerativeAI({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.3,
  });
  const graph = new StateGraph({
    channels: {
      input: null,
      intent: null,
      result: null,
    },
  });

  graph.addNode('router', async (state) => {
    const intent = detectIntent(state.input);
    return { intent };
  });

  graph.addNode('finance', async (state) => {
    const result = await handleFinance(state.input);
    return { result };
  });

  graph.addNode('schedule', async (state) => {
    const result = await handleSchedule(state.input);
    return { result };
  });

  graph.addNode('health', async (state) => {
    const result = await handleHealth(state.input);
    return { result };
  });

  graph.addNode('chat', async (state) => {
    const resp = await llm.invoke(state.input);
    return { result: extractText(resp) };
  });

  graph.addEdge('__start__', 'router');

  graph.addConditionalEdges('router', (state) => state.intent, {
    finance: 'finance',
    schedule: 'schedule',
    health: 'health',
    chat: 'chat',
  });

  graph.addEdge('finance', END);
  graph.addEdge('schedule', END);
  graph.addEdge('health', END);
  graph.addEdge('chat', END);

  return graph.compile();
}

export async function runAssistant(input) {
  const app = buildAssistantGraph();
  const result = await app.invoke({ input });
  return result.result;
}
