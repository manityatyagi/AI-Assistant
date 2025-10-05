import express from 'express';
import { startConversation, getConversation, sendMessage, endConversation } from '../controllers/chatSession.controllers.js';

const router = express.Router();

router.post('/', startConversation);
router.get('/:id', getConversation);
router.post('/:id/messages', sendMessage);
router.delete('/:id', endConversation);

export default router;