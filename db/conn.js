const { Sequelize } = require('sequelize')

// Use env variables so Docker / local setups can override easily
const DB_NAME = process.env.DB_NAME || 'projeto'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASS = process.env.DB_PASS || '14/02Luc'
const DB_HOST = process.env.DB_HOST || '127.0.0.1'
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
})

;(async () => {
    try {
        await sequelize.authenticate()
        console.log('Conectado ao MySQL!')
    } catch (error) {
        console.error('Não foi possível conectar ao MySQL:', error.message)
    }
})()

module.exports = sequelize