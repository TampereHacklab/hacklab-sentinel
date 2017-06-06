"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    lastLogin: {
        type:  DataTypes.DATE,
        field: "last_login"
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task);
      }
    },
    tableName: "user"
  });

  return User;
};
