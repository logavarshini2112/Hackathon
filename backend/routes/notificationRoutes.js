import express from 'express';
import NotificationModel from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// GET /api/notifications - Get logged-in user notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await NotificationModel.findByUserId(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/notifications/mark-read - Mark all notifications as read
router.put('/mark-read', async (req, res) => {
  try {
    await NotificationModel.markAllAsRead(req.user.id);
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
