'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {foreignKey : 'CategoryId'})
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: {
            msg : "name is required!"
           },
          notNull: {
            msg :  `name is required!`
          }
         }
      },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          notEmpty: {
            msg : "description is required!"
           },
          notNull: {
            msg :  `description is required!`
          }
        }
      },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : "price is required!"
        },
        min: {
          args: 1,
          msg : `price should be more than 1 rupiah `
        },
        notNull: {
          msg :  `price is required!`
        }
      }
    },

    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg : "imgUrl is required!"
         },
        notNull: {
          msg :  `imgUrl is required!`
          }
        }
      },

    CategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Categories",
        key : "id"
      },
      allowNull: false,
      validate: {
          notEmpty: {
          msg : "category is required!"
          }
        }
      },

      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
      
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};