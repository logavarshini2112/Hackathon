import pool from '../config/db.js';

export default class FeedbackModel {
  static async create({ visitorId, visitorName, department, feedbackType, subject, description, priority, incidentDate, imageUrl, assignedStaff = 'Unassigned' }) {
    const referenceId = `FB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const [result] = await pool.execute(
      `INSERT INTO feedback 
       (reference_id, visitor_id, visitor_name, department, feedback_type, subject, description, priority, incident_date, image_url, assigned_staff) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [referenceId, visitorId || null, visitorName, department, feedbackType, subject, description, priority || 'Medium', incidentDate, imageUrl || null, assignedStaff]
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

  static async findByAssignedStaff(staffName) {
    const [rows] = await pool.execute('SELECT * FROM feedback WHERE assigned_staff = ? ORDER BY created_at DESC', [staffName]);
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

  static async getAnalytics() {
    const [counts] = await pool.execute(`
      SELECT 
        COUNT(*) as totalFeedback,
        SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as openFeedback,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'Declined' THEN 1 ELSE 0 END) as declined,
        SUM(CASE WHEN escalation_status = 'Escalated' OR status = 'Escalated to Administrator' THEN 1 ELSE 0 END) as escalated,
        SUM(CASE WHEN escalation_status = 'Warning' THEN 1 ELSE 0 END) as warning,
        SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as highPriority
      FROM feedback
    `);

    const [deptCounts] = await pool.execute(`
      SELECT department, COUNT(*) as count
      FROM feedback
      GROUP BY department
      ORDER BY count DESC
    `);

    const [statusCounts] = await pool.execute(`
      SELECT status, COUNT(*) as count
      FROM feedback
      GROUP BY status
    `);

    const [priorityCounts] = await pool.execute(`
      SELECT priority, COUNT(*) as count
      FROM feedback
      GROUP BY priority
    `);

    const [typeCounts] = await pool.execute(`
      SELECT feedback_type as type, COUNT(*) as count
      FROM feedback
      GROUP BY feedback_type
    `);

    const [staffCounts] = await pool.execute(`
      SELECT 
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as activeStaff,
        COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactiveStaff
      FROM users WHERE role = 'Staff'
    `);

    return {
      summary: counts[0] || {},
      departmentDistribution: deptCounts,
      statusDistribution: statusCounts,
      priorityDistribution: priorityCounts,
      typeDistribution: typeCounts,
      staffCounts: staffCounts[0] || { activeStaff: 0, inactiveStaff: 0 },
    };
  }
}
