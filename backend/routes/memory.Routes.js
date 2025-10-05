import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { searchConversation, flagImportantMessage, getConversationContext } from '../controllers/savedChat.controllers.js';

const router = express.Router();

router.use(protect);

router.post('/search', searchConversation);
router.post('/flag-important', flagImportantMessage);
router.get('/context/:conversationId', getConversationContext);

export default router;