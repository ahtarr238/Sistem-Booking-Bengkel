// models/Booking.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Relasi ke User (Pelanggan)
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
      // Relasi ke Part (Barang)
      Booking.belongsTo(models.Part, { foreignKey: 'partId' });
    }
  }
  Booking.init({
    userId: DataTypes.INTEGER,
    partId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    booking_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW
    },
    queue_number: { type: DataTypes.INTEGER, allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    problem_description: DataTypes.TEXT,
    staff_notes: DataTypes.TEXT,
    recommended_replacements: DataTypes.JSON,
    damage_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};