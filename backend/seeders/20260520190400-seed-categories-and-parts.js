'use strict';
const { Category, Part } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Bersihkan data lama agar tidak terjadi duplikasi kunci asing/unik saat dijalankan berulang
    await queryInterface.bulkDelete('Parts', null, {});
    await queryInterface.bulkDelete('Categories', null, {});

    // 1. Buat Kategori
    const catOli = await Category.create({ name: 'Pelumas / Oli Mesin' });
    const catRem = await Category.create({ name: 'Sistem Pengereman' });
    const catKaki = await Category.create({ name: 'Ban & Kaki-kaki' });
    const catListrik = await Category.create({ name: 'Kelistrikan & Pengapian' });
    const catTransmisi = await Category.create({ name: 'Sistem Transmisi' });

    // 2. Buat Suku Cadang (Parts)
    await Part.bulkCreate([
      {
        categoryId: catOli.id,
        name: 'Oli Mesin Shell Advance AX7 10W-30 (0.8L)',
        price: 55000,
        stock: 25,
        min_stock: 5,
        image: null
      },
      {
        categoryId: catOli.id,
        name: 'Oli Mesin Yamalube Super Sport 10W-40 (1L)',
        price: 78000,
        stock: 15,
        min_stock: 4,
        image: null
      },
      {
        categoryId: catRem.id,
        name: 'Kampas Rem Depan Honda Beat / Vario (Orisinil)',
        price: 45000,
        stock: 30,
        min_stock: 8,
        image: null
      },
      {
        categoryId: catRem.id,
        name: 'Kampas Rem Belakang Yamaha Mio Tromol (Orisinil)',
        price: 38000,
        stock: 20,
        min_stock: 5,
        image: null
      },
      {
        categoryId: catKaki.id,
        name: 'Ban Luar FDR Sport XR Evo Tubeless 80/90-14',
        price: 185000,
        stock: 10,
        min_stock: 2,
        image: null
      },
      {
        categoryId: catKaki.id,
        name: 'Ban Luar Maxxis Victra S98 Tubeless 90/90-14',
        price: 280000,
        stock: 8,
        min_stock: 2,
        image: null
      },
      {
        categoryId: catListrik.id,
        name: 'Busi Standard NGK Spark Plugs CPR9EA-9',
        price: 25000,
        stock: 40,
        min_stock: 10,
        image: null
      },
      {
        categoryId: catListrik.id,
        name: 'Aki Kering GS Astra GTZ-5S MF 12V',
        price: 220000,
        stock: 2, // Sengaja diset di bawah min_stock untuk demo halaman Stok Rendah
        min_stock: 5,
        image: null
      },
      {
        categoryId: catTransmisi.id,
        name: 'Rantai & Gear Set Indoparts Honda Revo Fit',
        price: 145000,
        stock: 5,
        min_stock: 2,
        image: null
      },
      {
        categoryId: catTransmisi.id,
        name: 'V-Belt & Roller Kit Gates Powerlink Honda Beat FI',
        price: 165000,
        stock: 1, // Sengaja diset di bawah min_stock untuk demo halaman Stok Rendah
        min_stock: 3,
        image: null
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Parts', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
