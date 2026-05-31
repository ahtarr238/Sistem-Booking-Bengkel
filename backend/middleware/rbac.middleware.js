const { response } = require('../helpers/response.formatter');

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(response(401, 'Unauthorized - User tidak terautentikasi'));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json(response(403, 'Forbidden - Anda tidak memiliki akses'));
        }

        next();
    };
};

module.exports = { authorize };
