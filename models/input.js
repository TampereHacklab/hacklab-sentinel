"use strict";

module.exports = function(sequelize, DataTypes) {
  var Input = sequelize.define("Input", {
    index:  {
        field: "index",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fallingDelay: {
        field: "falling_delay",
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    risingDelay: {
        field: "rising_delay",
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    resolution: {
        field: "resolution",
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    enabled: {
        field: "enabled",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
          Input.belongsTo(models.DataCollector, {
            onDelete: "CASCADE",
            foreignKeyConstraint: true,
            foreignKey: "data_collector_id",
            as: "dataCollector"
          });
          Input.belongsTo(models.Device, {
             onDelete: "SET NULL",
             foreignKey: "device_id",
             as: "device"
          });
          Input.belongsTo(models.State, {
             onDelete: "SET NULL",
             foreignKey: "high_state_id",
             as: "highState"
          });
          Input.belongsTo(models.State, {
             onDelete: "SET NULL",
             foreignKey: "low_state_id",
             as: "lowState"
          });
        }
      },
    tableName: "input"
  });

  return Input;
};
