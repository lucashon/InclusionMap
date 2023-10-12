const { application } = require('express')
const {Sequelize} = require('sequelize')


//  Login Sesi: 'aluno_medio','@lunoSenai23.',
const sequelize =  new Sequelize('projeto','root','14/02Luc',{
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