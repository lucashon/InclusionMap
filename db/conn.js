const { application } = require('express')
const {Sequelize} = require('sequelize')

const sequelize =  new Sequelize('projeto','aluno_medio','@lunoSenai23.',{
    host:'127.0.0.1',
    port: 3306,
    dialect:'mysql'
})


try {
    sequelize.authenticate()
    console.log('Conectado ao MYSQL!')

} catch (error) {
    console.log(error)
}

module.exports = sequelize