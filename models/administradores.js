const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Administradores = db.define('administrador', {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
})

module.exports = Administradores