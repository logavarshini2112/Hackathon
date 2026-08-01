import express from 'express';
import { loginUser, registerVisitor, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerVisitor);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);

export default router;
