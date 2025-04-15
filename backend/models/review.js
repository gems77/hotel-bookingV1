'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Review.belongsTo(models.Hotel, {
        foreignKey: 'hotel_id',
        as: 'hotel'
      });

      Review.belongsTo(models.Booking, {
        foreignKey: 'booking_id',
        as: 'booking'
      });
    }
  }

  Review.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
    underscored: true
  });

  return Review;
};