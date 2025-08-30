'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wishlist.belongsTo(models.User, { foreignKey: 'UserId' });
      Wishlist.belongsTo(models.Product, { foreignKey: 'ProductId' });
    }
  }
  Wishlist.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      validate: {
        notEmpty: {
          msg: 'User ID is required'
        },
        notNull: {
          msg: 'User ID cannot be null'
        }
      }
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      },
      validate: {
        notEmpty: {
          msg: 'Product ID is required'
        },
        notNull: {
          msg: 'Product ID cannot be null'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'Wishlists',
    indexes: [
      {
        unique: true,
        fields: ['UserId', 'ProductId'],
        name: 'unique_user_product_wishlist'
      }
    ],
    // Add hooks for better data integrity
    hooks: {
      beforeCreate: async (wishlistItem, options) => {
        // Additional validation can be added here
        console.log(`Adding product ${wishlistItem.ProductId} to user ${wishlistItem.UserId}'s wishlist`);
      },
      beforeDestroy: async (wishlistItem, options) => {
        console.log(`Removing product ${wishlistItem.ProductId} from user ${wishlistItem.UserId}'s wishlist`);
      }
    }
  });
  return Wishlist;
};