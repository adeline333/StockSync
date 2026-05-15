const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// POST /api/ai/chat
router.post('/chat', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  // 🤖 THE PYTHON BRIDGE
  // This calls our Python AI script and passes the message
  const pythonProcess = spawn('python', ['ai_agent.py', message]);

  let pythonData = '';

  pythonProcess.stdout.on('data', (data) => {
    pythonData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ reply: "My AI brain is a bit tired right now. Please try again." });
    }
    res.json({ reply: pythonData.trim() });
  });
});

module.exports = router;
