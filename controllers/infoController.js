const { Router } = require('express')
const bcrypt = require('bcryptjs')
const Cidadaos = require('../models/cidadaos')
const Administradores = require('../models/administradores')
const { Op, fn, col } = require('sequelize')

module.exports = class infoController{
    
    // rota home
    static createCadastro(request, response){
        return response.render('home')
    }

    // entrar na conta 

    // cadastrar usuarios
    static async addCadastro(request, response){
        const cpf = String(request.body.cpf || '').replace(/\D/g, '')
        if (cpf.length !== 11) return response.status(400).send('O CPF deve conter exatamente 11 dígitos.')
        const cadastro = {
            nome: request.body.nome,
            email: request.body.email,
            cpf,
            descricao: request.body.doenca || request.body.descricao,
            dificuldade: request.body.barreira || request.body.dificuldade,
            bairro: request.body.bairro,
            cidade: request.body.cidade,
            estado: request.body.estado,
            doenca: request.body.doenca || request.body.descricao,
            barreira: request.body.barreira || request.body.dificuldade,
            foto: request.file ? `/uploads/${request.file.filename}` : null
        }

        // optionally hash password if provided
        if (request.body.senha) {
            const hash = await bcrypt.hash(request.body.senha, 10)
            cadastro.password = hash
        }

        const user = await Cidadaos.create(cadastro)
        request.session.regenerate((regenerateError) => {
            if (regenerateError) return response.status(503).send('Não foi possível iniciar a sessão.')
            request.session.userId = user.id
            request.session.userType = 'cidadao'
            request.session.save((saveError) => {
                if (saveError) return response.status(503).send('Não foi possível salvar a sessão.')
                return response.redirect(`/inclusion/login/${user.id}`)
            })
        })
    }
    
    // Mostrar
    static async mostrarInfo(request,response){
      
       try {
                const [count, bairros] = await Promise.all([
                        Cidadaos.count(),
                        Cidadaos.findAll({
                                attributes: ['bairro', [fn('COUNT', col('id')), 'count']],
                                where: { bairro: { [Op.not]: null } },
                                group: ['bairro'],
                                order: [['bairro', 'ASC']],
                                raw: true
                        })
                ])
            return response.render('dados', { count, bairros })
        
       } catch (error) {
        console.log(error)
      return  response.status(500).send('Erro interno do servidor ')
       }
            
    }


    // mostrar
    static async detalhes(request, response){
       const info =  await Cidadaos.findAll({raw: true})
        return response.render('info', {info})
    }

    // Perfil - prefeitura
    static async perfil(request,response){
        const id = request.params.id
        const perfil = await Cidadaos.findOne({raw:true, where:{id:id}})

       return response.render('individual', {perfil})
    }

    // Excluir perfil - Prefeitura 
    static async excluir(request,response){
        const id = request.params.id
        await Cidadaos.destroy({where:{id:id}})

       return response.redirect('/inclusion/mostrar')
    }

    // Perfil - login cidadão

    static async perfilCitizen(request, response){
        const id = request.params.id
        const perfilCitizen = await Cidadaos.findOne({raw:true, where:{id:id}})

        return response.render('user', {perfilCitizen})
    }

    // login
    static async login(request, response){
        const email = request.body.email || request.body.emailLogin
        const { senha, userType, redirectTo } = request.body
        const wantsJson = (request.headers.accept || '').includes('application/json')

        try {
            if (!email || !senha) {
                if (wantsJson) return response.status(400).json({ ok: false, message: 'Email e senha obrigatórios.' })
                return response.redirect('/')
            }

            const admin = await Administradores.findOne({ where: { email } })
            if (admin && await bcrypt.compare(senha, admin.password)) {
                request.session.regenerate((regenerateError) => {
                    if (regenerateError) {
                        return response.status(503).json({ ok: false, message: 'Não foi possível iniciar a sessão.' })
                    }
                    request.session.adminId = admin.id
                    request.session.userType = 'admin'
                    request.session.save((saveError) => {
                        if (saveError) {
                            return response.status(503).json({ ok: false, message: 'Não foi possível salvar a sessão.' })
                        }
                        const redirect = '/inclusion/dados'
                        if (wantsJson) return response.json({ ok: true, userId: admin.id, userType: 'admin', redirect })
                        return response.redirect(redirect)
                    })
                })
                return
            }

            const user = await Cidadaos.findOne({ where: { email } })
            if (!user || !user.password) {
                if (wantsJson) return response.status(401).json({ ok: false, message: 'Credenciais inválidas.' })
                return response.redirect('/')
            }

            const match = await bcrypt.compare(senha, user.password)
            if (!match) {
                if (wantsJson) return response.status(401).json({ ok: false, message: 'Credenciais inválidas.' })
                return response.redirect('/')
            }

            request.session.userId = user.id
            request.session.userType = 'cidadao'

            let redirect = `/inclusion/login/${user.id}`
            if (redirectTo && redirectTo.startsWith('/inclusion/login/')) redirect = redirectTo

            if (wantsJson) {
                return response.json({
                    ok: true,
                    userId: user.id,
                    userType: 'cidadao',
                    redirect
                })
            }

            return response.redirect(redirect)
        } catch (err) {
            console.error('Erro no login:', err && err.message ? err.message : err)
            if (wantsJson) {
                return response.status(503).json({
                    ok: false,
                    message: 'Serviço indisponível. Verifique se o MySQL está rodando.'
                })
            }
            return response.redirect('/')
        }
    }

    static async logout(request, response){
        request.session.destroy((err) => {
            if ((request.headers.accept || '').includes('application/json')) {
                return response.json({ ok: !err })
            }
            return response.redirect('/')
        })
    }

    // Mostrar dados antes do update //UPDATE etapa 01

    static async update1(request,response){
        const id = request.params.id
        const perfilCitizen = await Cidadaos.findOne({raw:true, where:{id:id}})
        return response.render('edit', {perfilCitizen})
    }

    // Fazer o UPDATE

    static async update(request,response){
        const id = request.body.id
        const novosDados = {
            nome: request.body.nome,
            email: request.body.email,
            cpf: String(request.body.cpf || '').replace(/\D/g, ''),
            descricao: request.body.doenca || request.body.descricao,
            dificuldade: request.body.barreira || request.body.dificuldade,
            bairro: request.body.bairro,
            cidade: request.body.cidade,
            estado: request.body.estado,
            doenca: request.body.doenca || request.body.descricao,
            barreira: request.body.barreira || request.body.dificuldade
        }
        if (request.body.senha) novosDados.password = await bcrypt.hash(request.body.senha, 10)
        if (request.file) novosDados.foto = `/uploads/${request.file.filename}`
        await Cidadaos.update(novosDados, {where:{id:id}})
       
        return response.redirect(`/inclusion/login/${id}`)
    }


}
