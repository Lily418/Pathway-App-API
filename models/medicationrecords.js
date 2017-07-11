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
  }, {
    classMethods: {
      associate: function(models) {
        models.MedicationRecord.belongsTo(models.User, {as: "User", foreignKey: 'user_id', targetKey: 'id'})
        models.MedicationRecord.hasOne(models.Medication, {as: "Medication", foreignKey: 'medication_id', targetKey: 'id'})
      }
    }
  });
  return MedicationRecords;
};
