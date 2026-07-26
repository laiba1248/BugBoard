//defines what user looks like
const {DataTypes}=require('sequelize');
const sequelize = require('../config/db');

const User=sequelize.define('User',{
    name:{
        type:DataTypes.STRING,
        alowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    role:{
        type:DataTypes.ENUM('admin','developer'),
        defaultValue:'developer',
    },
});
module.exports=User;