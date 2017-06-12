"use strict";

module.exports = function(sequelize, DataTypes) {
  var Settings = sequelize.define("Settings", {
    name: {
        field: "name",
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM,
        values: ["string", "integer", "datetime"],
        allowNull: false,
    },
    value: {
        field: "value",
        type: DataTypes.STRING,
        allowNull: false
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
        tableName: "settings",
    });

  return Settings;
};
