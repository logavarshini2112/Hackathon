import FeedbackModel from '../models/Feedback.js';
import UserModel from '../models/User.js';
import pool from '../config/db.js';

/**
 * @desc    Get all feedback tickets for admin
 * @route   GET /api/admin/feedback
 * @access  Private / Administrator
 */
export async function getAllFeedbackAdmin(req, res) {
  try {
    const records = await FeedbackModel.getAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @desc    Assign staff to ticket
 * @route   PUT /api/admin/assign-staff/:id
 * @access  Private / Administrator
 */
export async function assignStaffAdmin(req, res) {
  try {
    const { staffName } = req.body;
    const { id } = req.params;

    if (!staffName) {
      return res.status(400).json({ message: 'Staff name is required' });
    }

    const updated = await FeedbackModel.assignStaff(id, staffName);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @desc    Get staff roster
 * @route   GET /api/admin/staff-roster
 * @access  Private / Administrator
 */
export async function getStaffRosterAdmin(req, res) {
  try {
    const staff = await UserModel.getStaffRoster();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @desc    Toggle staff account status
 * @route   PUT /api/admin/toggle-staff/:id
 * @access  Private / Administrator
 */
export async function toggleStaffStatusAdmin(req, res) {
  try {
    const updatedUser = await UserModel.toggleStatus(req.params.id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
