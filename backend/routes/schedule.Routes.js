import express from 'express';
import { getSchedule, addEvent, deleteEvent } from '../controllers/schedule.controllers.js';

const router = express.Router();

router.get('/', getSchedule);
router.post('/', addEvent);
router.delete('/:id', deleteEvent);

export default router;
