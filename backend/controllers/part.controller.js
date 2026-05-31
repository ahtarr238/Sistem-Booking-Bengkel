const Validator = require('fastest-validator');
const v = new Validator();
const { Part, Category } = require('../models');
const { response } = require('../helpers/response.formatter');
const fs = require('fs'); // file system, melakukan sesuatu yang berhubungan dengan lokasi file
const path = require('path');
const { Op } = require('sequelize');

module.exports = {
    createPart: async (req, res) => {
        try {
            // ambil inputan (payload) dari req.body
            const { categoryId, name, price, stock, min_stock } = req.body;
            // req.file : mengambil input file dari middleware multer
            const image = req.file?.path;

            // validasi
            const schema = {
                categoryId: { type: "number", positive: true, integer: true },
                name: { type: "string", min: 3 },
                price: { type: "number", positive: true },
                stock: { type: "number", min: 0 },
                min_stock: { type: "number", min: 0 }
            }

            // menyiapkan data yang akan di validasi
            const data = {
                categoryId: Number(categoryId),
                name: String(name || '').trim(),
                price: Number(price),
                stock: Number(stock),
                min_stock: Number(min_stock)
            }

            const validate = v.validate(data, schema);
            // jika hasil validate ada error
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // cek jika image tidak diupload
            if (!image) {
                return res.status(400).json(response(400, "Validasi Error", "Image not found"));
            }

            const category = await Category.findByPk(data.categoryId);
            if (!category) {
                return res.status(404).json(response(404, "Kategori tidak ditemukan"));
            }

            // proses menyimpan data melalui ORM sequelize
            const part = await Part.create({
                categoryId: data.categoryId,
                name: data.name,
                price: data.price,
                stock: data.stock,
                min_stock: data.min_stock,
                image: image
            })

            return res.status(201).json(response(201, "Sparepart berhasil ditambahkan", part));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    getAllParts: async (req, res) => {
        try {
            // cari semua part
            const parts = await Part.findAll({
                include: [{ model: Category, attributes: ['id', 'name'] }]
            });
            return res.status(200).json(response(200, "Daftar Sparepart", parts));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    updatePart: async (req, res) => {
        try {
            // req.params : ambil path dinamis, /parts/2. ambil angka 2 (id)
            const { id } = req.params;
            const { categoryId, name, price, stock, min_stock } = req.body;
            const image = req.file?.path;

            const schema = {
                categoryId: { type: "number", positive: true, integer: true, optional: true },
                name: { type: "string", min: 3, optional: true },
                price: { type: "number", positive: true, optional: true },
                stock: { type: "number", min: 0, optional: true },
                min_stock: { type: "number", min: 0, optional: true }
            }

            const data = {
                categoryId: categoryId !== undefined && categoryId !== '' ? Number(categoryId) : undefined,
                name: name !== undefined && name !== '' ? String(name).trim() : undefined,
                price: price !== undefined && price !== '' ? Number(price) : undefined,
                stock: stock !== undefined && stock !== '' ? Number(stock) : undefined,
                min_stock: min_stock !== undefined && min_stock !== '' ? Number(min_stock) : undefined
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // cari part berdasarkan primary key
            const part = await Part.findByPk(id);
            if (!part) {
                return res.status(404).json(response(404, "Sparepart tidak ditemukan"));
            }

            if (data.categoryId !== undefined) {
                const category = await Category.findByPk(data.categoryId);
                if (!category) {
                    return res.status(404).json(response(404, "Kategori tidak ditemukan"));
                }
            }

            // kalau ada file baru, file lama dihapus
            if (req.file) {
                const oldImage = part.image;
                if (oldImage && fs.existsSync(oldImage)) {
                    fs.unlinkSync(oldImage);
                }
                data.image = image;
            }

            // hasil dari update proses hanya true/false bukan data terbaru
            const updateProcess = await Part.update(data, {
                where: { id: id }
            });
            // ambil data baru yang sudah diupdate
            const newPart = await Part.findByPk(id);
            return res.status(200).json(response(200, "Sparepart berhasil diperbarui", newPart));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    deletePart: async (req, res) => {
        try {
            // req.params : ambil path dinamis, /parts/2. ambil angka 2 (id)
            const { id } = req.params;

            // ambil data part untuk diambil gambar dan dihapus
            const part = await Part.findByPk(id);
            if (!part) {
                return res.status(404).json(response(404, "Sparepart tidak ditemukan"));
            }

            // hapus gambar jika ada
            if (part.image && fs.existsSync(part.image)) {
                fs.unlinkSync(part.image);
            }

            const deleteProcess = await Part.destroy({
                where: { id: id }
            });
            return res.status(200).json(response(200, "Sparepart berhasil dihapus"));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    getLowStockParts: async (req, res) => {
        try {
            // cari part yang stoknya di bawah min_stock
            const parts = await Part.findAll({
                where: {
                    stock: {
                        [Op.lt]: require('sequelize').col('min_stock')
                    }
                },
                include: [{ model: Category, attributes: ['id', 'name'] }]
            });

            return res.status(200).json(response(200, "Daftar Sparepart Stok Rendah", {
                total: parts.length,
                data: parts.map((part) => ({
                    id: part.id,
                    nama: part.name,
                    kategori: part.Category?.name,
                    harga: part.price,
                    stok_saat_ini: part.stock,
                    batas_minimum: part.min_stock,
                    selisih: part.min_stock - part.stock
                }))
            }));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
};
