const express = require('express')
const router = express.Router()

const infoController = require('../controllers/infoController')

//Localhost:3000/?/add
router.get('/home', infoController.createCadastro)
router.post('/home' , infoController.addCadastro)
router.get('/dados', infoController.mostrarInfo)
router.get('/mostrar', infoController.detalhes)

// router.post('/add', TaskController.createTaskSave)
// router.get('/all' , TaskController.showTask)
// router.post('/remove' , TaskController.deletTask)
// router.get('/atualizar/:id' , TaskController.upTask)
// router.post('/edit' , TaskController.updateTask)
// router.post('/updatestatus' , TaskController.toggletaskStatus)
// router.get('/' , TaskController.showTask)

module.exports = router