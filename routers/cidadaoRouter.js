const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()

const infoController = require('../controllers/infoController')
const { requireAdmin } = require('../middleware/auth')

const upload = multer({
	storage: multer.diskStorage({
		destination: path.join(__dirname, '..', 'public', 'uploads'),
		filename: (request, file, callback) => {
			const extension = path.extname(file.originalname).toLowerCase()
			callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`)
		}
	}),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (request, file, callback) => {
		callback(null, /^image\/(jpeg|png|webp|avif)$/.test(file.mimetype))
	}
})

//Localhost:3000/?/add
router.get('/home', infoController.createCadastro)
router.post('/home' , upload.single('foto'), infoController.addCadastro)
// auth
router.post('/auth/login', infoController.login)
router.post('/auth/logout', infoController.logout)
router.get('/dados', requireAdmin, infoController.mostrarInfo)
router.get('/mostrar', requireAdmin, infoController.detalhes)
router.get('/perfil/:id', requireAdmin, infoController.perfil)
router.post('/delete/:id', requireAdmin, infoController.excluir)
router.get('/login/:id', infoController.perfilCitizen)
router.get('/edit/:id', infoController.update1 )
router.post('/edit', upload.single('foto'), infoController.update)



module.exports = router