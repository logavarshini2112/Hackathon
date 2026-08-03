import FeedbackModel from '../models/Feedback.js';
import { processSlaEngine } from '../utils/slaEngine.js';

/**
 * @desc    Get assigned feedback for staff member
 * @route   GET /api/staff/assigned-feedback
 * @access  Private / Staff
 */
export async function getAssignedFeedback(req, res) {
  try {
    if (!req.user || !req.user.name) {
      return res.status(401).json({ message: 'Not authorized, staff profile missing' });
    }

    // Process SLA Engine rules before fetching
    await processSlaEngine();

    const records = await FeedbackModel.findByAssignedStaff(req.user.name);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to retrieve assigned feedback' });
  }
}

/**
 * @desc    Update ticket status by staff
 * @route   PUT /api/staff/update-status/:id
 * @access  Private / Staff
 */
export async function updateTicketStatus(req, res) {
  try {
    const { status, declineReason } = req.body;
    const { id } = req.params;

    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Declined', 'Escalated to Administrator'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid ticket status value: ${status}` });
    }

    const ticket = await FeedbackModel.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Feedback record not found' });
    }

    // Authorization Guard: Staff can only update tickets assigned to themselves
    if (ticket.assigned_staff !== req.user.name) {
      return res.status(403).json({ message: 'Forbidden: You can only update feedback tickets assigned to you' });
    }

    if (status === 'Declined' && (!declineReason || !declineReason.trim())) {
      return res.status(400).json({ message: 'Reason for declining is mandatory' });
    }

    const updated = await FeedbackModel.updateStatus(id, { status, declineReason });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update ticket status' });
  }
}
