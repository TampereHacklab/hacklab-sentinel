"use strict";

module.exports = function(sequelize, DataTypes) {
  var State = sequelize.define("State", {
    name:  {
        field: "name",
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        field: "description",
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        field: "color",
        type: DataTypes.STRING(6),
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
