const { Sale, Booking, Part, User, sequelize } = require('../models');
const { response } = require('../helpers/response.formatter');
const { exportSalesReport } = require('../helpers/excel.helper');

module.exports = {
    getMonthlySalesReport: async (req, res) => {
        try {
            // req.query : ambil params di postman/ambil data acuan untuk filter
            const { month, year } = req.query;

            let whereClause = {};
            // kalau di params postman ada month dan year, jalanin filter
            if (month && year) {
                whereClause = sequelize.where(
                    sequelize.fn('MONTH', sequelize.col('Sale.createdAt')),
                    month
                );
                whereClause = sequelize.and(
                    whereClause,
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('Sale.createdAt')), year)
                );
            }

            // cari semua sale dengan filter tanggal jika ada
            const sales = await Sale.findAll({
                where: whereClause,
                include: [
                    {
                        model: Booking,
                        include: [
                            { model: Part, attributes: ['id', 'name', 'price'] },
                            { model: User, attributes: ['id', 'name', 'email'] }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            const salesData = sales.map((sale) => ({
                id_sale: sale.id,
                id_booking: sale.bookingId,
                pelanggan: sale.Booking?.User?.name,
                email: sale.Booking?.User?.email,
                barang: sale.Booking?.Part?.name,
                jumlah: sale.Booking?.quantity,
                total_harga: sale.total_price,
                tanggal: sale.createdAt.toISOString().slice(0, 10)
            }));

            return res.status(200).json(response(200, "Laporan Penjualan Bulanan", {
                total: salesData.length,
                data: salesData
            }));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    exportMonthlySalesExcel: async (req, res) => {
        try {
            // req.query : ambil params di postman/ambil data acuan untuk filter
            const { month, year } = req.query;

            let whereClause = {};
            // kalau di params postman ada month dan year, jalanin filter
            if (month && year) {
                whereClause = sequelize.where(
                    sequelize.fn('MONTH', sequelize.col('Sale.createdAt')),
                    month
                );
                whereClause = sequelize.and(
                    whereClause,
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('Sale.createdAt')), year)
                );
            }

            // cari semua sale dengan filter tanggal jika ada
            const sales = await Sale.findAll({
                where: whereClause,
                include: [
                    {
                        model: Booking,
                        include: [
                            { model: Part, attributes: ['id', 'name', 'price'] },
                            { model: User, attributes: ['id', 'name', 'email'] }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            const salesData = sales.map((sale) => ({
                id_sale: sale.id,
                id_booking: sale.bookingId,
                pelanggan: sale.Booking?.User?.name,
                email: sale.Booking?.User?.email,
                barang: sale.Booking?.Part?.name,
                jumlah: sale.Booking?.quantity,
                total_harga: sale.total_price,
                tanggal: sale.createdAt.toISOString().slice(0, 10)
            }));

            // export ke excel menggunakan helper
            const filepath = await exportSalesReport(salesData);

            return res.download(filepath, `laporan-penjualan-${month || 'all'}-${year || new Date().getFullYear()}.xlsx`);
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
};
