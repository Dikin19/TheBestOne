'use strict';

const { truncate } = require('fs');

const fs = require ('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {

    let category = await fs.readFile("./data/category.json", "utf-8")
    category = JSON.parse(category)
    
    category.forEach(el => {
      delete el.id
      el.createdAt = new Date ()
      el.updatedAt = new Date ()
    });

    await queryInterface.bulkInsert('Categories', category,{});

  },


  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Categories', null, {
      restartIdentity: true,
      cascade: true,
      truncate: true
      });
 }
};