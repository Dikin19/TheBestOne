'use strict';
const fs = require ('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {

    let product = await fs.readFile("./data/product.json", "utf-8")
    product = JSON.parse(product)
    
    product.forEach(el => {
      delete el.id
      el.createdAt = new Date ()
      el.updatedAt = new Date ()
    });

    await queryInterface.bulkInsert('Products', product,{
      restartIdentity: true,
      cascade: true,
      truncate: true
    });

  },


  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Products', null, {});
 }
};