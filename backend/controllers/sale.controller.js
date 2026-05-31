const Validator = require('fastest-validator');
const v = new Validator();
const { Sale, Booking, Part, User, sequelize } = require('../models');
const { response } = require('../helpers/response.formatter');

module.exports = {
    createSale: async (req, res) => {
        try {
            // ambil inputan (payload) dari req.body
            const { booking_id, staff_notes, recommended_replacements } = req.body;
            // req.file : mengambil input file dari middleware multer
            const evidence = req.file?.path;

            // validasi
            const schema = {
                booking_id: { type: "number", positive: true, integer: true },
                staff_notes: { type: "string", optional: true },
                recommended_replacements: { type: "string", optional: true }
            }

            // menyiapkan data yang akan di validasi
            const data = {
                booking_id: Number(booking_id),
                staff_notes: staff_notes,
                recommended_replacements: recommended_replacements
            }

            const validate = v.validate(data, schema);
            // jika hasil validate ada error
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // cek jika evidence tidak diupload
            if (!evidence) {
                return res.status(400).json(response(400, "Bukti transaksi (foto nota/barang) wajib diunggah"));
            }

            return await sequelize.transaction(async (t) => {
                // cari booking berdasarkan id
                const booking = await Booking.findByPk(data.booking_id, {
                    include: [
                        { model: Part, attributes: ['id', 'name', 'price'] },
                        { model: User, attributes: ['id', 'name', 'email'] }
                    ],
                    transaction: t
                });

                if (!booking) {
                    return res.status(404).json(response(404, "Booking tidak ditemukan"));
                }

                if (booking.status === 'cancelled') {
                    return res.status(400).json(response(400, "Booking sudah di-cancel sebelumnya"));
                }

                if (booking.status === 'completed') {
                    return res.status(400).json(response(400, "Booking sudah selesai (sudah terjual)"));
                }

                // hitung total harga
                const totalPrice = booking.Part.price * booking.quantity;

                // buat sale baru
                const sale = await Sale.create({
                    bookingId: data.booking_id,
                    total_price: totalPrice,
                    evidence: evidence
                }, { transaction: t });

                // update booking dengan catatan staff dan rekomendasi
                await booking.update({
                    status: 'completed',
                    staff_notes: data.staff_notes,
                    recommended_replacements: data.recommended_replacements ? JSON.parse(data.recommended_replacements) : null
                }, { transaction: t });

                return res.status(201).json(response(201, "Transaksi berhasil", {
                    id_sale: sale.id,
                    id_booking: booking.id,
                    pelanggan: booking.User?.name,
                    barang: booking.Part?.name,
                    jumlah: booking.quantity,
                    total_harga: totalPrice,
                    bukti: evidence,
                    catatan_staff: data.staff_notes,
                    rekomendasi: booking.recommended_replacements,
                    tanggal: new Date().toISOString().slice(0, 10)
                }));
            });
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    getSales: async (req, res) => {
        try {
            // cari semua sale dengan relasi booking, user, dan part
            const sales = await Sale.findAll({
                include: [
                    {
                        model: Booking,
                        include: [
                            { model: User, attributes: ['id', 'name', 'email'] },
                            { model: Part, attributes: ['id', 'name', 'price'] }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json(response(200, "Daftar Transaksi", {
                total: sales.length,
                data: sales.map((sale) => ({
                    id_sale: sale.id,
                    id_booking: sale.bookingId,
                    pelanggan: sale.Booking?.User?.name,
                    email: sale.Booking?.User?.email,
                    barang: sale.Booking?.Part?.name,
                    jumlah: sale.Booking?.quantity,
                    total_harga: sale.total_price,
                    bukti: sale.evidence,
                    tanggal: sale.createdAt.toISOString().slice(0, 10)
                }))
            }));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    getSaleById: async (req, res) => {
        try {
            // req.params : ambil path dinamis, /sales/2. ambil angka 2 (sale_id)
            const sale_id = Number(req.params?.sale_id ?? req.params?.saleId);

            const schema = {
                sale_id: { type: "number", positive: true, integer: true }
            }

            const data = { sale_id }
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // cari sale berdasarkan primary key
            const sale = await Sale.findByPk(data.sale_id, {
                include: [
                    {
                        model: Booking,
                        include: [
                            { model: User, attributes: ['id', 'name', 'email'] },
                            { model: Part, attributes: ['id', 'name', 'price'] }
                        ]
                    }
                ]
            });

            if (!sale) {
                return res.status(404).json(response(404, "Transaksi tidak ditemukan"));
            }

            return res.status(200).json(response(200, "Detail Transaksi", {
                id_sale: sale.id,
                id_booking: sale.bookingId,
                pelanggan: sale.Booking?.User?.name,
                email: sale.Booking?.User?.email,
                barang: sale.Booking?.Part?.name,
                harga_satuan: sale.Booking?.Part?.price,
                jumlah: sale.Booking?.quantity,
                total_harga: sale.total_price,
                bukti: sale.evidence,
                status_booking: sale.Booking?.status,
                deskripsi_masalah: sale.Booking?.problem_description,
                catatan_staff: sale.Booking?.staff_notes,
                rekomendasi: sale.Booking?.recommended_replacements,
                tanggal: sale.createdAt.toISOString().slice(0, 10)
            }));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
};
