const { DataTypes, Model } = require('sequelize');
const { sequelize } = require("../db");

class Meeting extends Model { }
Meeting.init({
    title: DataTypes.STRING,
    userId:DataTypes.INTEGER,
    password:DataTypes.STRING,
    beginTime:DataTypes.TIME,
    endTime:DataTypes.TIME,
}, {
    sequelize, // 我们需要传递连接实例
    modelName: 'Meeting', // 我们需要选择模型名称
    timestamps: false,
});
module.exports = Meeting;