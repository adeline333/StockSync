const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM branches ORDER BY name');
    res.json({ branches: result.rows });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, location, contact, branch_type, manager_name, latitude, longitude } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO branches (name, location, contact, branch_type, manager_name, latitude, longitude) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [name, location || null, contact || null, branch_type || 'warehouse', manager_name || null, latitude || null, longitude || null]
    );
    res.status(201).json({ branch: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { name, location, contact, branch_type, manager_name, latitude, longitude } = req.body;
  try {
    const result = await db.query(
      'UPDATE branches SET name=$1, location=$2, contact=$3, branch_type=$4, manager_name=$5, latitude=$6, longitude=$7, updated_at=NOW() WHERE id=$8 RETURNING *',
      [name, location || null, contact || null, branch_type || 'warehouse', manager_name || null, latitude || null, longitude || null, req.params.id]
    );
    res.json({ branch: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
