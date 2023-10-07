const express = require('express')
const router = express.Router()

const infoController = require('../controllers/infoController')

//Localhost:3000/?/add
router.get('/home', infoController.createCadastro)
router.post('/home' , infoController.addCadastro)
router.get('/dados', infoController.mostrarInfo)
router.get('/mostrar', infoController.detalhes)
router.get('/perfil/:id', infoController.perfil)


module.exports = router