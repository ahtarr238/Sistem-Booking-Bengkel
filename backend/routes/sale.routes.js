const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createSale, getSales, getSaleById } = require('../controllers/sale.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

const evidenceDir = 'public/uploads/evidence/';
if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, evidenceDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'evidence-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const evidenceUpload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error('Hanya file gambar (jpg/png) yang diizinkan!'));
    }
});

router.post('/', authenticateToken, authorize('kasir', 'admin'), evidenceUpload.single('evidence'), createSale);
router.get('/', authenticateToken, authorize('admin', 'kasir'), getSales);
router.get('/:saleId', authenticateToken, authorize('admin', 'kasir'), getSaleById);

module.exports = router;
