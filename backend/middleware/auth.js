import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Access denied' });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
  };
};

export const validateSeceEmail = (req, res, next) => {
  const { email, role } = req.body;
  if (role === 'user' && !email.endsWith('@sece.ac.in')) {
    return res.status(400).json({ message: 'Students must use @sece.ac.in email' });
  }
  next();
};