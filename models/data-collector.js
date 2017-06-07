"use strict";

module.exports = function(sequelize, DataTypes) {
  var DataCollector = sequelize.define("DataCollector", {
    name:  {
        field: "name",
        type: DataTypes.STRING,
        allowNull: false
    },
    machineName: {
        field: "machine_name",
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        field: "description",
        type: DataTypes.STRING,
        allowNull: false
    },
    identifier: {
        field: "identifier",
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
          DataCollector.hasMany(models.Input, {
              foreignKey: "data_collector_id",
              onDelete: "CASCADE",
              as: "inputs"
          });
        }
    },
    tableName: "data_collector"
  });

  return DataCollector;
};
