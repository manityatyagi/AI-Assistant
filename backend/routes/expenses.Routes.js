import express from 'express';
import { listExpenses, addExpense, deleteExpense, summary } from '../controllers/expenses.controllers.js';

const router = express.Router();

router.get('/', listExpenses);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);
router.get('/summary', summary);

export default router;
