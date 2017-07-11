'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('Medications', [{
      name: "fluoxetine",
      createdAt: new Date(),
      updatedAt: new Date()
    },  {
      name: "duloxetine",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "trazodone",
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Medications', null, {});
  }
};
