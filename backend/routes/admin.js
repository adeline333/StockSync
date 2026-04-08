const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// User management
router.get('/users', ctrl.getUsers);
router.put('/users/:id/role', ctrl.updateUserRole);
router.post('/users/:id/unlock', ctrl.unlockUser);
router.delete('/users/:id', ctrl.deactivateUser);

// Categories
router.get('/categories', ctrl.getCategories);
router.put('/categories/rename', ctrl.renameCategory);
router.delete('/categories/:category', ctrl.deleteCategory);

// Backup & export
router.post('/backup', ctrl.triggerBackup);
router.get('/export', ctrl.exportAllData);

// API keys
router.get('/api-keys', ctrl.getApiKeys);
router.post('/api-keys', ctrl.generateApiKey);
router.delete('/api-keys/:id', ctrl.revokeApiKey);

module.exports = router;
