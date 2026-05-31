const Validator = require('fastest-validator');
const v = new Validator();
const { Category, Part } = require('../models');
const { response } = require('../helpers/response.formatter');

module.exports = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.findAll({
                order: [['name', 'ASC']]
            });

            return res.status(200).json(response(200, "Daftar kategori", categories));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    createCategory: async (req, res) => {
        try {
            const name = String(req.body?.name || '').trim();
            const schema = {
                name: { type: "string", min: 2 }
            };

            const validate = v.validate({ name }, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            const existing = await Category.findOne({ where: { name } });
            if (existing) {
                return res.status(400).json(response(400, "Kategori sudah ada"));
            }

            const category = await Category.create({ name });
            return res.status(201).json(response(201, "Kategori berhasil ditambahkan", category));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    updateCategory: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const name = String(req.body?.name || '').trim();
            const schema = {
                id: { type: "number", positive: true, integer: true },
                name: { type: "string", min: 2 }
            };

            const validate = v.validate({ id, name }, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json(response(404, "Kategori tidak ditemukan"));
            }

            const duplicate = await Category.findOne({ where: { name } });
            if (duplicate && duplicate.id !== id) {
                return res.status(400).json(response(400, "Kategori sudah ada"));
            }

            await category.update({ name });
            return res.status(200).json(response(200, "Kategori berhasil diperbarui", category));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const schema = {
                id: { type: "number", positive: true, integer: true }
            };

            const validate = v.validate({ id }, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json(response(404, "Kategori tidak ditemukan"));
            }

            const usedByParts = await Part.count({ where: { categoryId: id } });
            if (usedByParts > 0) {
                return res.status(400).json(response(400, "Kategori masih digunakan oleh sparepart"));
            }

            await category.destroy();
            return res.status(200).json(response(200, "Kategori berhasil dihapus"));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
};
