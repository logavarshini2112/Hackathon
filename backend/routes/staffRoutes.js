import express from 'express';
import { getAssignedFeedback, updateTicketStatus } from '../controllers/staffController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/assigned-feedback', protect, authorize('Staff'), getAssignedFeedback);
router.put('/update-status/:id', protect, authorize('Staff'), updateTicketStatus);

export default router;
