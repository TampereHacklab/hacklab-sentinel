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
        allowNull: false
    },
    risingDelay: {
        field: "rising_delay",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    resolution: {
        field: "resolution",
        type: DataTypes.INTEGER,
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
      classMethods: {
        associate: function(models) {
          Input.belongsTo(models.DataCollector, {
            onDelete: "CASCADE",
            foreignKey: "data_collector_id",
            as: "dataCollector"
          });
        }
      },
    tableName: "input"
  });

  return Input;
};
