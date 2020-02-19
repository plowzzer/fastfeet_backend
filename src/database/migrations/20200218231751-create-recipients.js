module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('recipients', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: null,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: null,
      },
      complement: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: null,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: null,
      },
      cep: {
        type: Sequelize.STRING,
        allowNull: null,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
