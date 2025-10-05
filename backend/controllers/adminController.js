import User from '../models/user.model.js';
import Conversation from '../models/conversation.model.js';
import Feedback from '../models/feedback.model.js';

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    next();
  } catch (error) {
    console.error('verifyAdmin error:', error);
    res.status(500).json({ error: 'Authorization error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('email name role createdAt').sort({ createdAt: -1 });
    if(!users) {
        return res.status(404).json({ 
            error: 'Users not found' 
      });
    }

    res.status(204).json({ 
        success: true, 
        count: users.length, 
        ...users 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        error: 'Error fetching users' 
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
        return res.status(404).json({ 
           error: 'User not found' 
      });
    }

    res.status(200).json({ 
        success: true, 
        ...user 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};

export const getConversationStats = async (req, res) => {
  try {
    const totalConversations = await Conversation.countDocuments();
    const recentCount = await Conversation.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    
    if (!totalConversations || !recentCount) {
       return res.status(404).json({ 
         error: 'Conversation stats not found' 
      });
    }

    res.status(200).json({
      success: true,
      totalConversations,
      last7Days: { count: recentCount },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        error: 'Error fetching conversation stats' 
    });
  }
};

export const getFeedbackStats = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const byStatus = await Feedback.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    res.json({ success: true, total, byStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching feedback stats' });
  }
};

export const getSystemHealth = async (req, res) => {
  try {
    res.json({ success: true, uptime: process.uptime(), timestamp: new Date().toISOString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching system health' });
  }
};

export const updateConfig = async (req, res) => {
  try {
    // Placeholder: accept config changes but do not persist
    res.status(200).json({ success: true, applied: req.body || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update config' });
  }
};