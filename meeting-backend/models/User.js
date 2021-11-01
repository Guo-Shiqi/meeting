const { DataTypes, Model } = require('sequelize');
const { sequelize } = require("../db");

class User extends Model { }
User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
}, {
    sequelize, // 我们需要传递连接实例
    modelName: 'User', // 我们需要选择模型名称
    timestamps: false,
});
module.exports = User;