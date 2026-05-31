const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const exportSalesReport = async (salesData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Laporan Penjualan');

            worksheet.columns = [
                { header: 'ID Transaksi', key: 'id_sale', width: 15 },
                { header: 'ID Booking', key: 'id_booking', width: 15 },
                { header: 'Pelanggan', key: 'pelanggan', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Barang', key: 'barang', width: 30 },
                { header: 'Jumlah', key: 'jumlah', width: 10 },
                { header: 'Total Harga', key: 'total_harga', width: 20 },
                { header: 'Tanggal', key: 'tanggal', width: 15 }
            ];

            salesData.forEach(sale => {
                worksheet.addRow({
                    id_sale: sale.id_sale,
                    id_booking: sale.id_booking,
                    pelanggan: sale.pelanggan,
                    email: sale.email,
                    barang: sale.barang,
                    jumlah: sale.jumlah,
                    total_harga: sale.total_harga,
                    tanggal: sale.tanggal
                });
            });

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };

            const filename = `laporan-penjualan-${Date.now()}.xlsx`;
            const filepath = path.join(__dirname, '../../public/reports', filename);

            if (!fs.existsSync(path.dirname(filepath))) {
                fs.mkdirSync(path.dirname(filepath), { recursive: true });
            }

            await workbook.xlsx.writeFile(filepath);
            resolve(filepath);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    exportSalesReport
};
