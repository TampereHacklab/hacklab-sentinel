"use strict";

module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define("Role", {
    name: DataTypes.STRING
  });

  return Role;
};
