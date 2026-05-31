const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

// Get monthly sales report (Admin only)
router.get('/sales', authenticateToken, authorize('admin'), reportController.getMonthlySalesReport);

// Export monthly sales to Excel (Admin only)
router.get('/sales/export', authenticateToken, authorize('admin'), reportController.exportMonthlySalesExcel);

module.exports = router;
