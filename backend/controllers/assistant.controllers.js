import { runAssistant } from '../services/langgraph.js';

export const queryAssistant = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'input (string) is required' });
    }
    const reply = await runAssistant(input);
    res.json({ reply });
  } catch (error) {
    console.error('Assistant query error:', error);
    res.status(500).json({ error: 'Failed to process assistant query' });
  }
};
