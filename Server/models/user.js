'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require(`bcryptjs`);
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, { foreignKey: 'UserId' });
      User.hasMany(models.Wishlist, { foreignKey: 'UserId' });
    }
  }
  User.init({
    fullName: DataTypes.STRING,

    email: {
      type:  DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg : "Email is required!"
        },
        isEmail:{
          msg: "Email must be email format"
        }
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: {
          msg : "Password is required!"
        },
        len: {
          args: [0, Infinity],
          msg : `password more than 4 characters `
        }
      }
    },

    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "customer",
  },

  isDeleted: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
},

    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    user.password = hashPassword(user.password)
  })
  return User;
};