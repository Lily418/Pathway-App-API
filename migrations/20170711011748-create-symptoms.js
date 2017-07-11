'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Symptoms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      daily_checkin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DailyCheckins',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
      return queryInterface.addIndex("Symptoms", ["name"], { indicesType: "FULLTEXT" })
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Symptoms');
  }
};
