'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      imgUrl: {
        type: Sequelize.STRING
      },

      CategoryId: { 
        type: Sequelize.INTEGER,
        references: {
          model: "Categories", // Pastikan nama model "Categories" sudah benar
          key: "id" // Ini harus sesuai dengan primary key di tabel Categories
        },
        onDelete: 'CASCADE', // Opsional, jika ingin menghapus produk saat kategori dihapus
        onUpdate: 'CASCADE'  // Opsional, jika ingin memperbarui CategoryId saat kategori diperbarui
      },

      stock: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
