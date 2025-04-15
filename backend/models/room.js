'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Room extends Model {
    static associate(models) {
      Room.belongsTo(models.Hotel, {
        foreignKey: 'hotel_id',
        as: 'hotel'
      });

      Room.belongsTo(models.RoomType, {
        foreignKey: 'room_type_id',
        as: 'room_type'
      });

      Room.hasMany(models.RoomAvailability, {
        foreignKey: 'room_id',
        as: 'availabilities'
      });

      Room.hasMany(models.Booking, {
        foreignKey: 'room_id',
        as: 'bookings'
      });
    }
  }

  Room.init({
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    has_air_conditioning: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_tv: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_minibar: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_smoking_allowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms',
    timestamps: true,
    underscored: true
  });

  return Room;
};