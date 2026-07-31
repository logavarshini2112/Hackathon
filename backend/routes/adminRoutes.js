import express from 'express';
import { 
  getAllFeedbackAdmin, 
  assignStaffAdmin, 
  getStaffRosterAdmin, 
  toggleStaffStatusAdmin 
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('Administrator'));

router.get('/feedback', getAllFeedbackAdmin);
router.put('/assign-staff/:id', assignStaffAdmin);
router.get('/staff-roster', getStaffRosterAdmin);
router.put('/toggle-staff/:id', toggleStaffStatusAdmin);

export default router;
