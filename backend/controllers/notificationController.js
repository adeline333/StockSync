const db = require('../db');

const getIP = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

// GET /api/notifications — get notifications for current user
exports.getNotifications = async (req, res) => {
  const { category, unread_only, page = 1, limit = 30 } = req.query;
  const offset = (page - 1) * limit;
  let conditions = [`(n.user_id = $1 OR n.user_id IS NULL)`];
  let params = [req.user.id];
  let idx = 2;

  if (category && category !== 'all') {
    conditions.push(`n.category = $${idx++}`);
    params.push(category);
  }
  if (unread_only === 'true') {
    conditions.push(`n.is_read = FALSE`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;
  params.push(parseInt(limit), parseInt(offset));

  try {
    const result = await db.query(
      `SELECT * FROM notifications ${where}
       ORDER BY n.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    const unreadCount = await db.query(
      `SELECT COUNT(*) FROM notifications n WHERE (n.user_id = $1 OR n.user_id IS NULL) AND n.is_read = FALSE`,
      [req.user.id]
    );

    res.json({ notifications: result.rows, unread_count: parseInt(unreadCount.rows[0].count) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/notifications/read/:id — mark one as read
exports.markRead = async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [req.params.id]);
    res.json({ message: 'Marked as read' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/notifications/read-all — mark all as read
exports.markAllRead = async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE (user_id = $1 OR user_id IS NULL) AND is_read = FALSE',
      [req.user.id]
    );
    res.json({ message: 'All marked as read' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/notifications/preferences — get user notification preferences
exports.getPreferences = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM notification_preferences WHERE user_id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      // Return defaults
      return res.json({
        preferences: {
          stock_alerts: true,
          transfer_requests: true,
          sales_reports: false,
          reconciliation_alerts: true,
          email_enabled: true,
          sms_enabled: false,
          alert_email: null,
          alert_phone: null,
        }
      });
    }
    res.json({ preferences: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/notifications/preferences — update preferences
exports.updatePreferences = async (req, res) => {
  const { stock_alerts, transfer_requests, sales_reports, reconciliation_alerts,
    email_enabled, sms_enabled, alert_email, alert_phone } = req.body;
  try {
    await db.query(
      `INSERT INTO notification_preferences (user_id, stock_alerts, transfer_requests, sales_reports, reconciliation_alerts, email_enabled, sms_enabled, alert_email, alert_phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (user_id) DO UPDATE SET
         stock_alerts=$2, transfer_requests=$3, sales_reports=$4, reconciliation_alerts=$5,
         email_enabled=$6, sms_enabled=$7, alert_email=$8, alert_phone=$9`,
      [req.user.id, stock_alerts, transfer_requests, sales_reports, reconciliation_alerts,
       email_enabled, sms_enabled, alert_email || null, alert_phone || null]
    );
    res.json({ message: 'Preferences saved' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper: create a notification (used internally by other controllers)
exports.createNotification = async (user_id, title, message, category, severity, action_url) => {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, category, severity, action_url)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [user_id || null, title, message, category || 'system', severity || 'info', action_url || null]
    );
  } catch (e) {
    console.error('Notification create error:', e.message);
  }
};
