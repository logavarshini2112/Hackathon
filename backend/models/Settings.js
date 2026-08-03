import pool from '../config/db.js';

export default class SettingsModel {
  /**
   * Get current system settings (or seed default if empty)
   */
  static async getSettings() {
    const [rows] = await pool.execute('SELECT * FROM settings LIMIT 1');
    if (rows.length > 0) {
      return rows[0];
    }

    // Default seed row if settings table is empty
    await pool.execute(
      `INSERT INTO settings 
       (institution_name, support_email, support_phone, escalation_days, enable_email_notifications, enable_in_app_notifications, enable_escalation_alerts, theme)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Digital Experience & Visitor Portal', 'support@visitorportal.com', '+91-9876543210', 10, 1, 1, 1, 'Light']
    );

    const [newRows] = await pool.execute('SELECT * FROM settings LIMIT 1');
    return newRows[0];
  }

  /**
   * Update system settings
   */
  static async updateSettings({ institutionName, supportEmail, supportPhone, escalationDays, enableEmailNotifications, enableInAppNotifications, enableEscalationAlerts, theme }) {
    const current = await this.getSettings();
    
    await pool.execute(
      `UPDATE settings SET 
       institution_name = ?,
       support_email = ?,
       support_phone = ?,
       escalation_days = ?,
       enable_email_notifications = ?,
       enable_in_app_notifications = ?,
       enable_escalation_alerts = ?,
       theme = ?
       WHERE id = ?`,
      [
        institutionName !== undefined ? institutionName : current.institution_name,
        supportEmail !== undefined ? supportEmail : current.support_email,
        supportPhone !== undefined ? supportPhone : current.support_phone,
        escalationDays !== undefined ? Number(escalationDays) : current.escalation_days,
        enableEmailNotifications !== undefined ? (enableEmailNotifications ? 1 : 0) : current.enable_email_notifications,
        enableInAppNotifications !== undefined ? (enableInAppNotifications ? 1 : 0) : current.enable_in_app_notifications,
        enableEscalationAlerts !== undefined ? (enableEscalationAlerts ? 1 : 0) : current.enable_escalation_alerts,
        theme !== undefined ? theme : current.theme,
        current.id
      ]
    );

    return this.getSettings();
  }
}
