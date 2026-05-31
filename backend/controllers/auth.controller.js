const Validator = require('fastest-validator');
const v = new Validator();
const { User } = require('../models');
const { response } = require('../helpers/response.formatter');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    login: async (req, res) => {
        try {
            // ambil inputan (payload) dari req.body
            const { email, password } = req.body || {};

            // validasi
            const schema = {
                email: { type: "email" },
                password: { type: "string", min: 6 }
            }

            const validate = v.validate({ email, password }, schema);
            // jika hasil validate ada error
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // cari user berdasarkan email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json(response(401, "Email atau password salah"));
            }

            // bandingkan password yang diinput dengan password yang sudah di-hash di database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json(response(401, "Email atau password salah"));
            }

            // buat token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'rahasia123',
                { expiresIn: '24h' }
            );

            return res.status(200).json(response(200, "Login berhasil", {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
};
