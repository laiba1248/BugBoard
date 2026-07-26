const {DataTypes} = require('sequelize');
const sequelize =require('../config/db');

const Bug=sequelize.define('Bug',{
    title:{
        type:DataTypes.STRING,
        allowNull:false,
    
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    stepsToReproduce:{
        type:DataTypes.TEXT,
        allowNull:true,
    },
    severity:{
        type:DataTypes.ENUM('low','medium','high','critical'),
        defaultValue:'medium',
    },
    status:{
        type:DataTypes.ENUM('open','in_progress','in_review','resolved','closed'),
        defaultValue:'open',
    },
});

const User=require('./User');
Bug.belongsTo(User,{as: 'reporter', forgeinKey:'reporterId'});
Bug.belongsTo(User,{as: 'assignee', forgeinKey:'assigneeId'});
module.exports =Bug;