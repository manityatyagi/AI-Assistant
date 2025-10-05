import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Not authorized, token missing' 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized, invalid token' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`Authentication error: ${error.message}`);
    return res.status(401).json({ 
        message: 'Not authorized' 
    });
  }
};

export { protect };