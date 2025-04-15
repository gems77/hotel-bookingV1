'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RoomType extends Model {
    static associate(models) {
      RoomType.hasMany(models.Room, {
        foreignKey: 'room_type_id',
        as: 'rooms'
      });
    }
  }

  RoomType.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    base_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'RoomType',
    tableName: 'room_types',
    timestamps: true,
    underscored: true
  });

  return RoomType;
};