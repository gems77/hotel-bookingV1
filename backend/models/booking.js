'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Booking.belongsTo(models.Room, {
        foreignKey: 'room_id',
        as: 'room'
      });
    }
  }

  Booking.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    check_in_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    check_out_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    adults: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    children: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true,
    underscored: true
  });

  return Booking;
};