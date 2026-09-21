const { Router } = require('express')
const bcrypt = require('bcryptjs')
const Cidadaos = require('../models/cidadaos')

module.exports = class infoController{
    
    // rota home
    static createCadastro(request, response){
        return response.render('home')
    }

    // entrar na conta 

    // cadastrar usuarios
    static async addCadastro(request, response){
        const cadastro = {
            nome: request.body.nome,
            email: request.body.email,
            cpf: request.body.cpf,
            descricao: request.body.descricao,
            dificuldade: request.body.dificuldade
        }

        // optionally hash password if provided
        if (request.body.senha) {
            const hash = await bcrypt.hash(request.body.senha, 10)
            cadastro.password = hash
        }

        await Cidadaos.create(cadastro)
        return response.redirect('/inclusion/home')
    }
    
    // Mostrar
    static async mostrarInfo(request,response){
      
       try {
        const count = await Cidadaos.count()
      return  response.render('dados', {count})
        
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
            request.session.userType = userType || 'geral'

            let redirect = `/inclusion/login/${user.id}`
            if (redirectTo) redirect = redirectTo
            else if (userType === 'prefeitura') redirect = '/inclusion/dados'
            else if (userType === 'cidadao') redirect = '/inclusion/mostrar'

            if (wantsJson) {
                return response.json({
                    ok: true,
                    userId: user.id,
                    userType: userType || 'geral',
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
            cpf: request.body.cpf,
            descricao: request.body.descricao,
            dificuldade: request.body.dificuldade
        }
        await Cidadaos.update(novosDados, {where:{id:id}})
       
        return response.redirect(`/inclusion/login/${id}`)
    }


}
