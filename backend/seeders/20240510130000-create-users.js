'use strict';

const bcrypt = require('bcrypt');

module.exports = {
    async up(queryInterface, Sequelize) {
        const adminPassword = await bcrypt.hash('admin123', 10);
        const kasirPassword = await bcrypt.hash('kasir123', 10);
        const userPassword = await bcrypt.hash('password123', 10);

        await queryInterface.bulkInsert('Users', [
            {
                name: 'Admin',
                email: 'admin@gmail.com',
                password: adminPassword,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Kasir',
                email: 'kasir@gmail.com',
                password: kasirPassword,
                role: 'kasir',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'User Test',
                email: 'user@example.com',
                password: userPassword,
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
