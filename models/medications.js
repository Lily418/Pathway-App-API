'use strict';
module.exports = function(sequelize, DataTypes) {
  var Medications = sequelize.define('Medication', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: DataTypes.STRING
  });
  return Medications;
};
