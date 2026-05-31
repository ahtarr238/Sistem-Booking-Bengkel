const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bookingController = require('../controllers/booking.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

// Direktori untuk menyimpan foto keluhan/kerusakan
const bookingDir = 'public/uploads/bookings/';
if (!fs.existsSync(bookingDir)) {
    fs.mkdirSync(bookingDir, { recursive: true });
}

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, bookingDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'booking-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Middleware multer untuk validasi berkas gambar
const bookingUpload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error('Hanya file gambar (jpg/png) yang diizinkan!'));
    }
});

// Create booking (User, Kasir) dengan opsional unggah foto keluhan
router.post('/', authenticateToken, authorize('user', 'kasir'), bookingUpload.single('damage_image'), bookingController.createBooking);

// Get today's queue (Kasir, Admin)
router.get('/today', authenticateToken, authorize('kasir', 'admin'), bookingController.getTodayQueue);

// Get my bookings (User)
router.get('/my', authenticateToken, authorize('user'), bookingController.getMyBookings);

// Cancel booking (User, Kasir, Admin)
router.delete('/:booking_id', authenticateToken, authorize('user', 'kasir', 'admin'), bookingController.cancelBooking);

module.exports = router;
