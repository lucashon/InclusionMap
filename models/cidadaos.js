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
    },
    bairro:{
        type: DataTypes.STRING,
        allowNull: true
    },
    cidade:{
        type: DataTypes.STRING,
        allowNull: true
    },
    estado:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'AL'
    },
    doenca:{
        type: DataTypes.STRING,
        allowNull: true
    },
    barreira:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    foto:{
        type: DataTypes.STRING,
        allowNull: true
    }
    ,password: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = sequelize