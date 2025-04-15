'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class HotelImage extends Model {
    static associate(models) {
      HotelImage.belongsTo(models.Hotel, {
        foreignKey: 'hotel_id',
        as: 'hotel'
      });
    }
  }

  HotelImage.init({
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'HotelImage',
    tableName: 'hotel_images',
    underscored: true,
    timestamps: true
  });

  return HotelImage;
};