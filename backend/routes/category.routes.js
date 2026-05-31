const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

router.get('/', authenticateToken, authorize('admin'), categoryController.getCategories);
router.post('/', authenticateToken, authorize('admin'), categoryController.createCategory);
router.put('/:id', authenticateToken, authorize('admin'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
