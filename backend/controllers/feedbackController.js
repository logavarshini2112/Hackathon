import FeedbackModel from '../models/Feedback.js';

/**
 * @desc    Submit new visitor feedback
 * @route   POST /api/feedback
 * @access  Private / Visitor
 */
export async function createFeedback(req, res) {
  try {
    const { department, feedbackType, subject, description, priority, incidentDate } = req.body;

    if (!department || !feedbackType || !subject || !description) {
      return res.status(400).json({ message: 'Department, type, subject, and description are required' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const feedback = await FeedbackModel.create({
      visitorId: req.user ? req.user.id : null,
      visitorName: req.user ? req.user.name : 'Anonymous Visitor',
      department,
      feedbackType,
      subject,
      description,
      priority: priority || 'Medium',
      incidentDate: incidentDate || new Date().toISOString().split('T')[0],
      imageUrl,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @desc    Get visitor's submitted feedback records
 * @route   GET /api/feedback/my-feedback
 * @access  Private / Visitor
 */
export async function getMyFeedback(req, res) {
  try {
    const records = await FeedbackModel.findByVisitorId(req.user.id);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
