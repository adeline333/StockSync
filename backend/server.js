const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/reconciliation', require('./routes/reconciliation'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/transfers', require('./routes/transfers'));

// Start scheduled jobs
require('./scheduler');

// Main GET route
app.get('/', (req, res) => {
  res.send('StockSync API is running');
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    // Attempt to connect to the database to ensure it's up
    const res = await db.query('SELECT NOW()');
    console.log('Database connected successfully:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection failed. Please check your config and ensure PostgreSQL is running.');
    console.error(err.message);
  }
});
