const Validator = require('fastest-validator');
const v = new Validator();
const { Booking, Part, User, sequelize } = require('../models');
const { response } = require('../helpers/response.formatter');

module.exports = {
    createBooking: async (req, res) => {
        try {
            // ambil inputan (payload) dari req.body
            const { part_id, quantity, problem_description } = req.body;
            // ambil userId dan role dari token yang sudah di-decode di middleware
            const userId = req.user?.id;
            const role = req.user?.role;
            // Hanya pelanggan (role 'user') yang boleh membuat booking
            if (role !== 'user') {
                return res.status(403).json(response(403, "Hanya pelanggan yang dapat membuat booking"));
            }

            // validasi
            const schema = {
                part_id: { type: "number", positive: true, integer: true, convert: true },
                quantity: { type: "number", positive: true, integer: true, convert: true },
                problem_description: { type: "string", optional: true }
            }

            // menyiapkan data yang akan di validasi
            const data = {
                part_id: Number(part_id),
                quantity: Number(quantity),
                problem_description: problem_description
            }

            const validate = v.validate(data, schema);
            // jika hasil validate ada error
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            if (!userId) {
                return res.status(401).json(response(401, "Unauthorized"));
            }

            // Mendapatkan tanggal hari ini YYYY-MM-DD sesuai zona waktu lokal Jakarta (WIB) agar nomor antrian reset tepat pukul 00:00 WIB
            const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });

            return await sequelize.transaction(async (t) => {
                // cari part berdasarkan id
                const part = await Part.findByPk(data.part_id, { transaction: t });
                if (!part) {
                    return res.status(404).json(response(404, "Part tidak ditemukan"));
                }
                // cek stok
                if (part.stock < data.quantity) {
                    return res.status(400).json(response(400, `Stok tidak mencukupi, tersedia ${part.stock}`));
                }

                // cari booking terakhir hari ini untuk generate nomor antrian
                const lastBooking = await Booking.findOne({
                    where: { booking_date: today },
                    order: [['queue_number', 'DESC']],
                    transaction: t
                });
                const nextQueueNumber = lastBooking ? lastBooking.queue_number + 1 : 1;

                // kurangi stok part
                await part.update({ stock: part.stock - data.quantity }, { transaction: t });

                // buat booking baru (menyimpan path foto keluhan jika ada)
                const booking = await Booking.create({
                    userId,
                    partId: data.part_id,
                    quantity: data.quantity,
                    booking_date: today,
                    queue_number: nextQueueNumber,
                    status: 'pending',
                    problem_description: data.problem_description,
                    damage_image: req.file?.path || null
                }, { transaction: t });

                return res.status(201).json(response(201, "Booking berhasil", {
                    id: booking.id,
                    tanggal: today,
                    antrian_ke: nextQueueNumber,
                    barang: part.name,
                    jumlah: data.quantity,
                    deskripsi_masalah: data.problem_description,
                    gambar_kerusakan: booking.damage_image
                }));
            });
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    getTodayQueue: async (req, res) => {
        try {
            // Mendapatkan tanggal hari ini YYYY-MM-DD sesuai zona waktu lokal Jakarta (WIB)
            const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
            // cari semua booking hari ini
            const bookings = await Booking.findAll({
                where: { booking_date: today },
                include: [
                    { model: User, attributes: ['id', 'name', 'email'] },
                    { model: Part, attributes: ['id', 'name'] }
                ],
                order: [['queue_number', 'ASC']],
                attributes: ['id', 'userId', 'partId', 'quantity', 'queue_number', 'status', 'createdAt', 'problem_description', 'staff_notes', 'recommended_replacements', 'damage_image']
            });

            return res.status(200).json(response(200, "Antrian hari ini", {
                tanggal: today,
                total: bookings.length,
                data: bookings.map((booking) => ({
                    id_booking: booking.id,
                    antrian_ke: booking.queue_number,
                    pelanggan: booking.User?.name,
                    email: booking.User?.email,
                    barang: booking.Part?.name,
                    jumlah: booking.quantity,
                    status: booking.status,
                    deskripsi_masalah: booking.problem_description,
                    catatan_staff: booking.staff_notes,
                    rekomendasi: booking.recommended_replacements,
                    gambar_kerusakan: booking.damage_image
                }))
            }));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    getMyBookings: async (req, res) => {
        try {
            const userId = req.user?.id;
            // Mendapatkan tanggal hari ini YYYY-MM-DD sesuai zona waktu lokal Jakarta (WIB)
            const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
            
            if (!userId) {
                return res.status(401).json(response(401, "Unauthorized"));
            }

            // Cari semua booking milik user yang sedang login untuk hari ini
            const bookings = await Booking.findAll({
                where: { userId, booking_date: today },
                include: [
                    { model: Part, attributes: ['id', 'name', 'price'] }
                ],
                order: [['queue_number', 'ASC']]
            });

            return res.status(200).json(response(200, "Booking aktif Anda hari ini", {
                tanggal: today,
                data: bookings.map((booking) => ({
                    id_booking: booking.id,
                    antrian_ke: booking.queue_number,
                    barang: booking.Part?.name,
                    jumlah: booking.quantity,
                    status: booking.status,
                    deskripsi_masalah: booking.problem_description,
                    gambar_kerusakan: booking.damage_image
                }))
            }));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    cancelBooking: async (req, res) => {
        try {
            // req.params : ambil path dinamis, /bookings/2. ambil angka 2 (booking_id)
            const booking_id = Number(req.params?.booking_id ?? req.params?.bookingId);

            const booking = await Booking.findByPk(booking_id, {
                include: [{ model: Part, attributes: ['id', 'stock'] }]
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

            return await sequelize.transaction(async (t) => {
                // kembalikan stok
                await booking.Part.update({ stock: booking.Part.stock + booking.quantity }, { transaction: t });
                // update status booking
                await booking.update({ status: 'cancelled' }, { transaction: t });

                return res.status(200).json(response(200, "Booking berhasil di-cancel", booking));
            });
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
};