import pool from '../config/db.js';

export default class FeedbackModel {
  static async create({ visitorId, visitorName, department, feedbackType, subject, description, priority, incidentDate, imageUrl }) {
    const referenceId = `FB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const [result] = await pool.execute(
      `INSERT INTO feedback 
       (reference_id, visitor_id, visitor_name, department, feedback_type, subject, description, priority, incident_date, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [referenceId, visitorId || null, visitorName, department, feedbackType, subject, description, priority || 'Medium', incidentDate, imageUrl || null]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM feedback WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByVisitorId(visitorId) {
    const [rows] = await pool.execute('SELECT * FROM feedback WHERE visitor_id = ? ORDER BY created_at DESC', [visitorId]);
    return rows;
  }

  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM feedback ORDER BY created_at DESC');
    return rows;
  }

  static async updateStatus(id, { status, declineReason }) {
    let escalationStatus = 'Normal';
    if (status === 'Escalated to Administrator') {
      escalationStatus = 'Escalated';
    }

    await pool.execute(
      'UPDATE feedback SET status = ?, decline_reason = ?, escalation_status = ? WHERE id = ?',
      [status, declineReason || null, escalationStatus, id]
    );

    return this.findById(id);
  }

  static async assignStaff(id, staffName) {
    await pool.execute(
      'UPDATE feedback SET assigned_staff = ? WHERE id = ?',
      [staffName, id]
    );
    return this.findById(id);
  }
}
