import express from 'express';
import { queryAssistant } from '../controllers/assistant.controllers.js';

const router = express.Router();

router.post('/query', queryAssistant);

export default router;
