import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from '../models/User.js';

dotenv.config();

/**
 * Protect Routes with JWT
 */
export async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

      req.user = await UserModel.findById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ message: 'User account not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
}

/**
 * Role-Based Access Control Middleware
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: User role '${req.user?.role}' does not have permission to access this resource` 
      });
    }
    next();
  };
}
