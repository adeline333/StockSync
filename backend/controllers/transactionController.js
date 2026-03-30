const db = require('../db');

// Helper to handle PostgreSQL transactions
const executeTransaction = async (callback) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

exports.receive = async (req, res) => {
  const { product_id, dest_branch_id, quantity } = req.body;
  const user_id = req.user.id;

  if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be positive' });

  try {
    const result = await executeTransaction(async (client) => {
      // 1. Update Inventory (Upsert)
      await client.query(
        `INSERT INTO inventory (product_id, branch_id, quantity) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (product_id, branch_id) 
         DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity`,
        [product_id, dest_branch_id, quantity]
      );

      // 2. Record Transaction
      const txResult = await client.query(
        `INSERT INTO transactions (product_id, dest_branch_id, type, quantity, user_id, status)
         VALUES ($1, $2, 'receive', $3, $4, 'completed') RETURNING *`,
        [product_id, dest_branch_id, quantity, user_id]
      );
      return txResult.rows[0];
    });

    res.status(201).json({ message: 'Receive transaction successful', transaction: result });
  } catch (error) {
    console.error('Receive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sale = async (req, res) => {
  const { product_id, source_branch_id, quantity } = req.body;
  const user_id = req.user.id;

  if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be positive' });

  try {
    const result = await executeTransaction(async (client) => {
      // 1. Check current inventory
      const invResult = await client.query(
        'SELECT quantity FROM inventory WHERE product_id = $1 AND branch_id = $2 FOR UPDATE',
        [product_id, source_branch_id]
      );

      if (invResult.rows.length === 0 || invResult.rows[0].quantity < quantity) {
        throw new Error('Insufficient stock for sale');
      }

      // 2. Deduct inventory
      await client.query(
        'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 AND branch_id = $3',
        [quantity, product_id, source_branch_id]
      );

      // 3. Record transaction
      const txResult = await client.query(
        `INSERT INTO transactions (product_id, source_branch_id, type, quantity, user_id, status)
         VALUES ($1, $2, 'sale', $3, $4, 'completed') RETURNING *`,
        [product_id, source_branch_id, quantity, user_id]
      );
      return txResult.rows[0];
    });

    res.status(201).json({ message: 'Sale transaction successful', transaction: result });
  } catch (error) {
    console.error('Sale error:', error.message);
    if (error.message === 'Insufficient stock for sale') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.transfer = async (req, res) => {
  const { product_id, source_branch_id, dest_branch_id, quantity } = req.body;
  const user_id = req.user.id;

  if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be positive' });
  if (source_branch_id === dest_branch_id) return res.status(400).json({ message: 'Cannot transfer to the same branch' });

  try {
    const result = await executeTransaction(async (client) => {
      // 1. Check current source inventory
      const invResult = await client.query(
        'SELECT quantity FROM inventory WHERE product_id = $1 AND branch_id = $2 FOR UPDATE',
        [product_id, source_branch_id]
      );

      if (invResult.rows.length === 0 || invResult.rows[0].quantity < quantity) {
        throw new Error('Insufficient stock for transfer');
      }

      // 2. Deduct from source branch
      await client.query(
        'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 AND branch_id = $3',
        [quantity, product_id, source_branch_id]
      );

      // 3. Add to destination branch (Upsert)
      await client.query(
        `INSERT INTO inventory (product_id, branch_id, quantity) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (product_id, branch_id) 
         DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity`,
        [product_id, dest_branch_id, quantity]
      );

      // 4. Record transaction
      const txResult = await client.query(
        `INSERT INTO transactions (product_id, source_branch_id, dest_branch_id, type, quantity, user_id, status)
         VALUES ($1, $2, $3, 'transfer', $4, $5, 'completed') RETURNING *`,
        [product_id, source_branch_id, dest_branch_id, quantity, user_id]
      );
      return txResult.rows[0];
    });

    res.status(201).json({ message: 'Transfer transaction successful', transaction: result });
  } catch (error) {
    console.error('Transfer error:', error.message);
    if (error.message === 'Insufficient stock for transfer') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
