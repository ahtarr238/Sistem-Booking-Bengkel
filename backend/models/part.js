'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Part extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Part ini milik sebuah kategori
      this.belongsTo(models.Category, { foreignKey: 'categoryId' });
      // Part bisa muncul di banyak booking
      this.hasMany(models.Booking, { foreignKey: 'partId' });
    }
  }
  Part.init({
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    min_stock: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Part',
  });
  return Part;
};