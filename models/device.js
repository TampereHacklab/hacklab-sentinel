"use strict";

module.exports = function(sequelize, DataTypes) {
  var Device = sequelize.define("Device", {
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
    image: {
        field: "image",
        type: DataTypes.TEXT,
        allowNull: true
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

    tableName: "device"
  });

  return Device;
};
