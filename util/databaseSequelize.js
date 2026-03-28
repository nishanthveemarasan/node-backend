const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('app_db', 'app_user', 'password', {
    host: 'mysql',
    dialect: 'mysql',
    port: 3306,
});

module.exports = sequelize;