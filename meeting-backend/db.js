const Sequelize = require('sequelize')
const {
    dbName,
    host,
    port,
    user,
    password
} = require('./config').database

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'postgres',
    host,
    port,
    pool: {
        max: 5, //连接池最大连接数量
        min: 0, //最小连接数量
        idle: 10000, //如果一个线程 10秒内沒有被使用过的话，就释放
    },
    logging: console.log,
})
//对连接进行测试，查看控制台
// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('******Connection has been established successfully.********');
//         console.log('******测试结束，即将退出！！！********');
//         process.exit(); //结束进程
//     })
//     .catch(err => {
//         console.error('***************Unable to connect to the database:***********', err);
//     }); 

// 创建模型
module.exports = { sequelize }
