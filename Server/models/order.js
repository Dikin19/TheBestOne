'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {foreignKey: "UserId"})
      Order.belongsTo(models.Product, {foreignKey: "ProductId"})
    }
  }
  Order.init({

    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key : "id"
      },
      allowNull: false,
      validate: {
          notEmpty: {
          msg : "User is required!"
          }
        }
      },

    ProductId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Products",
        key : "id"
      },
      allowNull: false,
      validate: {
          notEmpty: {
          msg : "Product is required!"
          }
        }
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }

  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};