'use strict';
module.exports = function(sequelize, DataTypes) {
  var Symptoms = sequelize.define('Symptom', {
    name: DataTypes.STRING,
    daily_checkin_id: {
      type: DataTypes.INTEGER,
      required: true
    },
  });
  return Symptoms;
};
