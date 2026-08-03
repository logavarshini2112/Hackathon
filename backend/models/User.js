import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export default class UserModel {
  /**
   * Find user by email address using mysql2
   */
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Find user by primary key ID using mysql2
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, user_id_code, name, email, role, department, phone, avatar_url, status, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      // Fallback if avatar_url column doesn't exist yet on MySQL instance
      const [rows] = await pool.execute(
        'SELECT id, user_id_code, name, email, role, department, phone, status, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    }
  }

  /**
   * Create a new user with hashed password using bcryptjs and mysql2 insert
   */
  static async createUser({ name, email, password, role = 'Visitor', department = null, phone = null }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const codePrefix = role === 'Visitor' ? 'VIS' : role === 'Staff' ? 'STF' : 'ADM';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const userIdCode = `${codePrefix}-2026-${randomSuffix}`;

    const [result] = await pool.execute(
      'INSERT INTO users (user_id_code, name, email, password, role, department, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userIdCode, name, email, hashedPassword, role, department, phone]
    );

    return this.findById(result.insertId);
  }

  /**
   * Compare plain text password against stored hashed password using bcryptjs
   */
  static async comparePassword(enteredPassword, hashedPassword) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  }

  /**
   * Update profile fields (name, phone, email) for a user
   */
  static async updateProfile(id, { name, phone, email }) {
    const current = await this.findById(id);
    if (!current) return null;

    const newName = name !== undefined ? name.trim() : current.name;
    const newPhone = phone !== undefined ? phone.trim() : current.phone;
    const newEmail = email !== undefined ? email.trim().toLowerCase() : current.email;

    await pool.execute(
      'UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?',
      [newName, newPhone, newEmail, id]
    );

    return this.findById(id);
  }

  /**
   * Update user password using bcryptjs hash
   */
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return true;
  }

  /**
   * Update profile photo URL
   */
  static async updateAvatar(id, avatarUrl) {
    try {
      await pool.execute('ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255) DEFAULT NULL');
    } catch (e) {
      // Column already exists, ignore error
    }
    await pool.execute('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, id]);
    return this.findById(id);
  }

  /**
   * Fetch staff roster records
   */
  static async getStaffRoster() {
    const [rows] = await pool.execute(
      'SELECT id, user_id_code as staffId, name as staffName, department, role, email, status FROM users WHERE role = "Staff"'
    );
    return rows;
  }

  /**
   * Find active staff user belonging to a specific department
   */
  static async findStaffByDepartment(department) {
    const [rows] = await pool.execute(
      'SELECT id, user_id_code, name, department, role, status FROM users WHERE role = "Staff" AND department = ? AND status = "Active" LIMIT 1',
      [department]
    );
    return rows[0] || null;
  }

  /**
   * Toggle active/inactive account status
   */
  static async toggleStatus(id) {
    const user = await this.findById(id);
    if (!user) return null;
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    await pool.execute('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);
    return this.findById(id);
  }
}
