"use strict";

module.exports = function(sequelize, DataTypes) {
  var State = sequelize.define("State", {
    name:  {
        field: "name",
        type: DataTypes.STRING,
        allowNull: false
    },
    machineName: {
        field: "machine_name",
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        field: "description",
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        field: "color",
        type: DataTypes.STRING(7),
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

    tableName: "state"
  });

  return State;
};
