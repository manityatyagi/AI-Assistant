import express from 'express';
import { submitFeedback, getUserFeedback, getAllFeedback, resolveFeedback } from '../controllers/feedback.controllers.js';

const router = express.Router();

router.post('/', submitFeedback);
router.get('/', getUserFeedback);
router.get('/all', getAllFeedback);
router.patch('/:id/resolve', resolveFeedback);

export default router;