const { Router } = require('express')
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
            deficiencia: request.body.deficiencia,
            dificuldade: request.body.dificuldade
        }
        await Cidadaos.update(novosDados, {where:{id:id}})
       
        return response.redirect(`/inclusion/login/${id}`)
    }


}
