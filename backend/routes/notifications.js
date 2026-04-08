const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', ctrl.getNotifications);
router.post('/read-all', ctrl.markAllRead);
router.post('/read/:id', ctrl.markRead);
router.get('/preferences', ctrl.getPreferences);
router.put('/preferences', ctrl.updatePreferences);

module.exports = router;
