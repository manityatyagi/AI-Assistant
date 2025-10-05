import Expense from '../models/expense.model.js';

export const listExpenses = async (req, res) => {
  try {
    if (!Expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    const items = await Expense.find({}).sort({ date: -1, createdAt: -1 });
    const data = items.map(e => ({
      id: String(e._id),
      amount: e.amount,
      category: e.category,
      note: e.note,
      date: e.date,
    }));
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to list expenses:', error);
    res.status(500).json({ message: 'Failed to list expenses' });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;
    if (typeof amount !== 'number' || !category) {
      return res.status(400).json({ message: 'amount (number) and category are required' });
    }
    const created = await Expense.create({ amount, category, note, date });
    if (!created) {
      return res.status(500).json({ message: 'Failed to add expense' });
    }

    res.status(201).json({
      id: String(created._id),
      amount: created.amount,
      category: created.category,
      note: created.note,
      date: created.date,
    });
  } catch (error) {
    console.error('Failed to add expense:', error);
    res.status(500).json({ message: 'Failed to add expense' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Expense.findByIdAndDelete(id);
    if (!removed) {
      return res.status(404).json({ 
        message: 'Expense not found' 
      });
    }

    res.status(204).json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Failed to delete expense:', error);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};

export const summary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const y = Number(year) || now.getFullYear();
    const m = Number(month) || (now.getMonth() + 1);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);

    const agg = await Expense.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    const total = agg.reduce((s, a) => s + a.total, 0);
    res.status(200).json({ 
      month: m, 
      year: y, 
      total, 
      byCategory: agg.map(a => 
        ({ category: a._id, total: a.total, count: a.count })) });
  } catch (error) {
    console.error('Failed to get summary:', error);
    res.status(500).json({ message: 'Failed to get summary' });
  }
};
