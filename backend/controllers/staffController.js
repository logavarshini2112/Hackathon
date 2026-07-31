import FeedbackModel from '../models/Feedback.js';

/**
 * @desc    Get assigned feedback for staff member
 * @route   GET /api/staff/assigned-feedback
 * @access  Private / Staff
 */
export async function getAssignedFeedback(req, res) {
  try {
    const allRecords = await FeedbackModel.getAll();
    const staffDept = req.user.department;

    // Filter feedback assigned to staff name or matching staff department
    const records = allRecords.filter(
      (r) => r.assigned_staff === req.user.name || r.department === staffDept
    );

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    if (status === 'Declined' && (!declineReason || !declineReason.trim())) {
      return res.status(400).json({ message: 'Reason for declining is mandatory' });
    }

    const updated = await FeedbackModel.updateStatus(id, { status, declineReason });
    if (!updated) {
      return res.status(404).json({ message: 'Feedback record not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
