'use strict';
module.exports = function(sequelize, DataTypes) {
  var MedicationRecords = sequelize.define('MedicationRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    dateStarted: DataTypes.DATE,
    dose: DataTypes.STRING,
    user_id: {
      type: DataTypes.INTEGER,
      required: true
    },
    medication_id: {
      type: DataTypes.INTEGER,
      required: true
    }
  });
  return MedicationRecords;
};
