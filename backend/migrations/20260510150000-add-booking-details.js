'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Bookings', 'problem_description', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('Bookings', 'staff_notes', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('Bookings', 'recommended_replacements', {
            type: Sequelize.JSON,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Bookings', 'problem_description');
        await queryInterface.removeColumn('Bookings', 'staff_notes');
        await queryInterface.removeColumn('Bookings', 'recommended_replacements');
    }
};
