import request from 'supertest';
import app from '../app.js';

async function run() {
  const results = [];
  try {
    const root = await request(app).get('/');
    results.push({ name: 'GET /', status: root.status, body: root.text || root.body });

    const assistant = await request(app)
      .post('/api/v1/assistant/query')
      .send({ input: 'hello world' })
      .set('Content-Type', 'application/json');
    results.push({ name: 'POST /api/v1/assistant/query', status: assistant.status, body: assistant.body });
  } catch (err) {
    console.error('Smoke test error:', err);
    process.exitCode = 1;
  }

  console.log(JSON.stringify({ results }, null, 2));
}

run();
