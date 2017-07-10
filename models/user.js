'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true},
    name: DataTypes.STRING,
    dateBeganUsingApp: DataTypes.DATE,
  })
  return User;
};
