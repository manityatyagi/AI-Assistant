import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { verifyAdmin, getAllUsers, getUserById, getConversationStats, getFeedbackStats, getSystemHealth, updateConfig } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, verifyAdmin);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

router.get('/conversations/stats', getConversationStats);
router.get('/feedback/stats', getFeedbackStats);

router.get('/system/health', getSystemHealth);
router.patch('/system/config', updateConfig);

export default router;