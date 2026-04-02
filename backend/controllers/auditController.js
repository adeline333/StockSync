const db = require('../db');

exports.getLogs = async (req, res) => {
  const { range, user_id, action, search } = req.query;

  let conditions = [];
  let params = [];
  let idx = 1;

  // Date range filter
  if (range === '24h') {
    conditions.push(`al.created_at >= NOW() - INTERVAL '24 hours'`);
  } else if (range === '7d') {
    conditions.push(`al.created_at >= NOW() - INTERVAL '7 days'`);
  } else if (range === '30d') {
    conditions.push(`al.created_at >= NOW() - INTERVAL '30 days'`);
  }

  // User filter
  if (user_id && user_id !== 'all') {
    conditions.push(`al.user_id = $${idx++}`);
    params.push(user_id);
  }

  // Action filter
  if (action && action !== 'all') {
    conditions.push(`al.action = $${idx++}`);
    params.push(action);
  }

  // Search filter
  if (search) {
    conditions.push(`(al.details ILIKE $${idx} OR al.action ILIKE $${idx} OR u.name ILIKE $${idx})`);
    params.push(`%${search}%`);
    idx++;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const result = await db.query(
      `SELECT al.id, al.action, al.details, al.ip_address, al.created_at,
              u.name as user_name, u.email as user_email, u.role as user_role
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ${where}
       ORDER BY al.created_at DESC
       LIMIT 100`,
      params
    );

    // Get distinct users for filter dropdown
    const usersResult = await db.query(
      'SELECT DISTINCT u.id, u.name, u.role FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id WHERE u.id IS NOT NULL ORDER BY u.name'
    );

    res.json({ logs: result.rows, users: usersResult.rows });
  } catch (e) {
    console.error('Audit log error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};
