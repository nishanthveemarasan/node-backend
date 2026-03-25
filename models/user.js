const {DataTypes} = require('sequelize');
const sequelize = require('../util/databaseSequelize');

const User = sequelize.define("User",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    }
 
});

module.exports = User;