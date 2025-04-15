'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hotels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      star_rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      has_wifi: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_pool: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_restaurant: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_parking: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_gym: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('hotels');
  }
};