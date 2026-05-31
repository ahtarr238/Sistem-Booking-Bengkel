const express = require('express');
const router = express.Router();
const upload = require('./upload');
const partController = require('../controllers/part.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

// Get All Parts (Public)
router.get('/', partController.getAllParts);

// Create Part (Admin only)
router.post('/', authenticateToken, authorize('admin'), upload.single('image'), partController.createPart);

// Get Low Stock Alert (Admin only)
router.get('/low-stock', authenticateToken, authorize('admin'), partController.getLowStockParts);

// Update Part (Admin only)
router.put('/:id', authenticateToken, authorize('admin'), upload.single('image'), partController.updatePart);

// Delete Part (Admin only)
router.delete('/:id', authenticateToken, authorize('admin'), partController.deletePart);

module.exports = router;
