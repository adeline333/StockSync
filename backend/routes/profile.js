const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.put('/change-password', profileController.changePassword);
router.post('/2fa/setup', profileController.setup2FA);
router.post('/2fa/verify', profileController.verify2FA);
router.post('/2fa/disable', profileController.disable2FA);

module.exports = router;
