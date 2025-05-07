'use strict';

/** @type {import('sequelize-cli').Migration} */
const {hashPassword} = require ('../helpers/bcrypt')
module.exports = {
  async up(queryInterface, Sequelize) {

    const dataUser = require("../data/user.json").map(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()
      el.password = hashPassword(el.password)
      return el
    })

    await queryInterface.bulkInsert('Users', dataUser)
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Users', null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
    })
  }
};
