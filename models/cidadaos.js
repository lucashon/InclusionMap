const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const sequelize = db.define('cadastro', {
    nome:{
        type: DataTypes.STRING,
        require: true
    },
    email:{
        type: DataTypes.STRING,
        require: true
    },
    cpf:{
        type: DataTypes.STRING,
        require: true
    },
    descricao:{
        type: DataTypes.STRING,
        require: true
    },
    dificuldade:{
        type: DataTypes.STRING,
        require: true
    }
    ,password: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = sequelize