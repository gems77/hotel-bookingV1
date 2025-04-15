'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hotel_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hotels',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      room_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'room_types',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      room_number: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      floor: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      has_air_conditioning: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_tv: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_minibar: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_smoking_allowed: {
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms');
  }
};