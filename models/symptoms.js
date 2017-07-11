'use strict';
module.exports = function(sequelize, DataTypes) {
  var Symptoms = sequelize.define('Symptom', {
    name: DataTypes.STRING,
    daily_checkin_id: {
      type: DataTypes.INTEGER,
      required: true
    },
  }, {
    classMethods: {
      associate: function(models) {
        Symptom.belongsTo(models.DailyCheckin, {
          "targetKey": "id", "foreignKey": "daily_checkin_id"
        })
      }
    }
  });
  return Symptoms;
};
