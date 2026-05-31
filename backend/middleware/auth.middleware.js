const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { response } = require('../helpers/response.formatter');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json(response(401, 'Token tidak ditemukan'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahasia123');
        
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json(response(401, 'User tidak ditemukan'));
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(response(401, 'Token telah kedaluwarsa'));
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json(response(401, 'Token tidak valid'));
        }
        return res.status(500).json(response(500, 'Server Error', error.message));
    }
};

module.exports = { authenticateToken };
