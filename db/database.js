const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    dialect: 'mysql',
    host: 'localhost',
  },
)
module.exports = sequelize
