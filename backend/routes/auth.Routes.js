import express from 'express';
import { signUp, login, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', protect, logout);

export default router;