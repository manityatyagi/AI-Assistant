import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: false 
    },
    amount: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    category: { 
      type: String, 
      required: true 
    },
    note: { 
      type: String 
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
  }, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
