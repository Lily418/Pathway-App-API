'use strict';
module.exports = function(sequelize, DataTypes) {
  var DailyCheckin = sequelize.define('DailyCheckin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    wellbeingScore: DataTypes.INTEGER,
    medicationTaken: DataTypes.BOOLEAN,
    date: DataTypes.DATE,
    user_id: {
      type: DataTypes.INTEGER,
      required: true
    },
    
  });
  return DailyCheckin;
};
