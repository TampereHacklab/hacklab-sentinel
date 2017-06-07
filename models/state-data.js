"use strict";

module.exports = function(sequelize, DataTypes) {
  var StateData = sequelize.define("StateData", {
    start:  {
        field: "start",
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        field: "end",
        type: DataTypes.DATE,
        allowNull: true
    },
    duration: {
        field: "duration",
        type: DataTypes.INTEGER,
        allowNull: true,
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
          StateData.belongsTo(models.Device, {
            onDelete: "CASCADE",
            foreignKeyConstraint: true,
            foreignKey: "device_id",
            as: "device"
          });
          StateData.belongsTo(models.State, {
             onDelete: "CASCADE",
             foreignKey: "state_id",
             as: "state"
          });

        }
      },
    tableName: "state_data"
  });

  return StateData;
};
