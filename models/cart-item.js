const {DataTypes} = require('sequelize');
const sequelize = require('../util/databaseSequelize');

const CartItem = sequelize.define("CartItem",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
        allowNull: false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

module.exports = CartItem;