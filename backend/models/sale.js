'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Booking, { foreignKey: 'bookingId' });
    }
  }
  Sale.init({
    bookingId: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    evidence: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};