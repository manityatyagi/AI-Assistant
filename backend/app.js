import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.Routes.js';
import pluginRoutes from './routes/plugin.Routes.js';
import adminRoutes from './routes/admin.Routes.js';
import conversationRoutes from './routes/conversation.Routes.js';
import feedbackRoutes from './routes/feedback.Routes.js';
import memoryRoutes from './routes/memory.Routes.js';
import assistantRoutes from './routes/assistant.Routes.js';
import tasksRoutes from './routes/tasks.Routes.js';
import scheduleRoutes from './routes/schedule.Routes.js';
import expensesRoutes from './routes/expenses.Routes.js';
import webhookRoutes from './routes/webhook.Routes.js';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/memory', memoryRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/plugins', pluginRoutes);
app.use('/api/v1/assistant', assistantRoutes);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/schedule', scheduleRoutes);
app.use('/api/v1/expenses', expensesRoutes);
app.use('/api/v1/integrations', webhookRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

export default app;
