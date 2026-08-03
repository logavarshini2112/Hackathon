import express from 'express';
import { 
  loginUser, 
  registerVisitor, 
  getUserProfile, 
  updateUserProfile, 
  changeUserPassword, 
  uploadUserProfilePhoto 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerVisitor);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changeUserPassword);
router.post('/profile-photo', protect, upload.single('image'), uploadUserProfilePhoto);

export default router;
