'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Hotel extends Model {
    static associate(models) {
      Hotel.hasMany(models.Room, {
        foreignKey: 'hotel_id',
        as: 'rooms'
      });

      Hotel.belongsToMany(models.User, {
        through: 'favorites',
        foreignKey: 'hotel_id',
        as: 'users'
      });

      Hotel.hasMany(models.HotelImage, {
        foreignKey: 'hotel_id',
        as: 'images'
      });

      Hotel.hasMany(models.Review, {
        foreignKey: 'hotel_id',
        as: 'reviews'
      });
    }
  }

  Hotel.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    star_rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    has_wifi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_pool: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_restaurant: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_parking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_gym: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Hotel',
    tableName: 'hotels',
    timestamps: true,
    underscored: true
  });

  return Hotel;
};