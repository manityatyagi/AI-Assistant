import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { createWebhook, getWebhooks, deleteWebhook, initOAuth, handleOAuthCallback } from '../controllers/integration.controllers.js';

const router = express.Router();

router.use(protect);

router.post('/webhooks', createWebhook);
router.get('/webhooks', getWebhooks);
router.delete('/webhooks/:id', deleteWebhook);

router.get('/oauth/:provider', initOAuth);
router.get('/oauth/:provider/callback', handleOAuthCallback);

export default router;