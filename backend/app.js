require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const db = require('./models');
const bookingRoutes = require('./routes/booking.routes');
const partRoutes = require('./routes/part.routes');
const authRoutes = require('./routes/auth.routes');
const saleRoutes = require('./routes/sale.routes');
const reportRoutes = require('./routes/report.routes');
const categoryRoutes = require('./routes/category.routes');

const app = express();
const port = 3000;

db.sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});

// Static files & Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('API Uji Kelayakan - Sparepart Booking System')
})

app.use('/auth', authRoutes);
app.use('/bookings', bookingRoutes);
app.use('/parts', partRoutes);
app.use('/categories', categoryRoutes);
app.use('/sales', saleRoutes);
app.use('/reports', reportRoutes);

// Error Middleware (Harus di paling bawah setelah semua route)
app.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({
            status: 400,
            message: "Bad Request / Format Request Salah",
            error: err.message
        });
    }
    next();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

module.exports = app;
