import pool from '../config/db.js';
import SettingsModel from '../models/Settings.js';
import NotificationModel from '../models/Notification.js';

/**
 * Deterministic Rule-Based SLA Engine
 */
export async function processSlaEngine() {
  try {
    const settings = await SettingsModel.getSettings();
    const thresholdDays = settings.escalation_days || 10;
    const warningThresholdDays = Math.floor(thresholdDays * 0.8);

    // Fetch all unresolved tickets
    const [unresolvedTickets] = await pool.execute(
      "SELECT * FROM feedback WHERE status NOT IN ('Resolved', 'Declined')"
    );

    const currentTime = Date.now();

    for (const ticket of unresolvedTickets) {
      const createdTime = new Date(ticket.created_at).getTime();
      const diffTime = Math.max(0, currentTime - createdTime);
      const daysPending = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let newEscalationStatus = 'Normal';
      let newStatus = ticket.status;

      if (daysPending >= thresholdDays) {
        newEscalationStatus = 'Escalated';
        newStatus = 'Escalated to Administrator';
      } else if (daysPending >= warningThresholdDays) {
        newEscalationStatus = 'Warning';
        if (ticket.status === 'Escalated to Administrator') {
          newStatus = 'In Progress';
        }
      } else {
        newEscalationStatus = 'Normal';
        if (ticket.status === 'Escalated to Administrator') {
          newStatus = 'Open';
        }
      }

      // Detect state transitions for notification creation
      const transitionToWarning = ticket.escalation_status !== 'Warning' && newEscalationStatus === 'Warning';
      const transitionToEscalated = ticket.escalation_status !== 'Escalated' && newEscalationStatus === 'Escalated';

      // Update feedback row in MySQL (keeping assigned_staff unchanged!)
      await pool.execute(
        'UPDATE feedback SET days_pending = ?, escalation_status = ?, status = ? WHERE id = ?',
        [daysPending, newEscalationStatus, newStatus, ticket.id]
      );

      // Handle Notifications if enabled in settings
      if (settings.enable_in_app_notifications && settings.enable_escalation_alerts) {
        if (transitionToWarning && ticket.assigned_staff && ticket.assigned_staff !== 'Unassigned') {
          const [staffUsers] = await pool.execute(
            'SELECT id FROM users WHERE name = ? LIMIT 1',
            [ticket.assigned_staff]
          );
          if (staffUsers.length > 0) {
            await NotificationModel.create({
              userId: staffUsers[0].id,
              title: 'SLA Warning Alert',
              description: `Feedback ticket #${ticket.reference_id} (${ticket.department}) is approaching the SLA threshold (${daysPending} days pending). Please review and resolve it.`,
              type: 'warning'
            });
          }
        }

        if (transitionToEscalated) {
          const [adminUsers] = await pool.execute(
            'SELECT id FROM users WHERE role = "Administrator"'
          );
          for (const admin of adminUsers) {
            await NotificationModel.create({
              userId: admin.id,
              title: 'Feedback Ticket Escalated',
              description: `Feedback ticket #${ticket.reference_id} (${ticket.department}) has been escalated to Administrator because it exceeded the SLA threshold (${daysPending} days pending). Assigned Staff: ${ticket.assigned_staff}.`,
              type: 'escalated'
            });
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error running processSlaEngine:', error.message);
    return false;
  }
}
