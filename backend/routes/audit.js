const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);
router.get('/', auditController.getLogs);

module.exports = router;
