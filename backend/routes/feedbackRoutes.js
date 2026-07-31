import express from 'express';
import { createFeedback, getMyFeedback } from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('Visitor', 'Administrator'), upload.single('image'), createFeedback);
router.get('/my-feedback', protect, authorize('Visitor', 'Administrator'), getMyFeedback);

export default router;
