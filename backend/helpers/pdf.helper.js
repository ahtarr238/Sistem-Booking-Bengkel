const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (saleData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const filename = `invoice-${saleData.id_sale}-${Date.now()}.pdf`;
            const filepath = path.join(__dirname, '../../public/invoices', filename);

            if (!fs.existsSync(path.dirname(filepath))) {
                fs.mkdirSync(path.dirname(filepath), { recursive: true });
            }

            doc.pipe(fs.createWriteStream(filepath));

            doc.fontSize(20).text('INVOICE / STRUK TRANSAKSI', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`ID Transaksi: #${saleData.id_sale}`, { align: 'left' });
            doc.text(`ID Booking: #${saleData.id_booking}`, { align: 'left' });
            doc.text(`Tanggal: ${saleData.tanggal}`, { align: 'left' });
            doc.moveDown();

            doc.fontSize(14).text('Informasi Pelanggan', { underline: true });
            doc.fontSize(12).text(`Nama: ${saleData.pelanggan}`);
            doc.text(`Email: ${saleData.email}`);
            doc.moveDown();

            doc.fontSize(14).text('Detail Barang', { underline: true });
            doc.fontSize(12).text(`Nama Barang: ${saleData.barang}`);
            doc.text(`Jumlah: ${saleData.jumlah}`);
            doc.moveDown();

            doc.fontSize(14).text('Total Pembayaran', { underline: true });
            doc.fontSize(16).text(`Rp ${saleData.total_harga.toLocaleString('id-ID')}`, { align: 'right' });
            doc.moveDown();

            doc.fontSize(10).text('Terima kasih telah bertransaksi dengan kami!', { align: 'center' });

            doc.end();

            doc.on('end', () => {
                resolve(filepath);
            });

            doc.on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateInvoice };
