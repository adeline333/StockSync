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
  const { name, location, contact } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO branches (name, location, contact) VALUES ($1,$2,$3) RETURNING *',
      [name, location || null, contact || null]
    );
    res.status(201).json({ branch: result.rows[0] });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
