'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Favorite.belongsTo(models.Hotel, {
        foreignKey: 'hotel_id',
        as: 'hotel'
      });
    }
  }

  Favorite.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'Favorite',
    tableName: 'favorites',
    underscored: true,
    timestamps: true
  });

  return Favorite;
};