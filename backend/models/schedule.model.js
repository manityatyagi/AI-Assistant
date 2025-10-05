import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: false 
    },
    title: { 
      type: String, 
      required: true 
    },
    date: { 
      type: String, 
      required: true 
    },
    time: { 
      type: String, 
      required: false 
    },
    details: { 
      type: String 
    },
}, { timestamps: true });

export default mongoose.model('Schedule', scheduleSchema);
