import express from 'express';
import { loginUser, registerVisitor, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerVisitor);
router.get('/profile', protect, getUserProfile);

export default router;
