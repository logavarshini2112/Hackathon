import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export default class UserModel {
  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT id, user_id_code, name, email, role, department, phone, status, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async createUser({ name, email, password, role = 'Visitor', department = null, phone = null }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const codePrefix = role === 'Visitor' ? 'VIS' : role === 'Staff' ? 'STF' : 'ADM';
    const userIdCode = `${codePrefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const [result] = await pool.execute(
      'INSERT INTO users (user_id_code, name, email, password, role, department, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userIdCode, name, email, hashedPassword, role, department, phone]
    );

    return this.findById(result.insertId);
  }

  static async comparePassword(enteredPassword, hashedPassword) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  }

  static async getStaffRoster() {
    const [rows] = await pool.execute(
      'SELECT id, user_id_code as staffId, name as staffName, department, role, email, status FROM users WHERE role = "Staff"'
    );
    return rows;
  }

  static async toggleStatus(id) {
    const user = await this.findById(id);
    if (!user) return null;
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    await pool.execute('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);
    return this.findById(id);
  }
}
