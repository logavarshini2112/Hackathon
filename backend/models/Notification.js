import pool from '../config/db.js';

export default class NotificationModel {
  /**
   * Create a notification record
   */
  static async create({ userId, title, description, type = 'info' }) {
    const [result] = await pool.execute(
      'INSERT INTO notifications (user_id, title, description, type) VALUES (?, ?, ?, ?)',
      [userId || null, title, description, type]
    );
    return this.findById(result.insertId);
  }

  /**
   * Find notification by primary key ID
   */
  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM notifications WHERE id = ?', [id]);
    return rows[0] || null;
  }

  /**
   * Get notifications for a user
   */
  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId) {
    await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL',
      [userId]
    );
    return true;
  }
}
