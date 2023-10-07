const { Router } = require('express')
const Cidadaos = require('../models/cidadaos')

module.exports = class infoController{
    
    // rota home
    static createCadastro(request, response){
        return response.render('home')
    }

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
        response.render('dados', {count})
        
       } catch (error) {
        console.log(error)
        response.status(500).send('Erro interno do servidor ')
       }
            
    }


    // mostrar
    static async detalhes(request, response){
       const info =  await Cidadaos.findAll({raw: true})
        return response.render('info', {info})
    }



    // static async deletTask(request, response){
    //     const id = request.body.id
    //      await Task.destroy({where: {id: id}})
        
    //      return response.redirect('/tasks/all')
    //  }


    // //  atualizar 01
    //  static async upTask(request, response){
    //     const id = request.params.id
    //     const task = await Task.findOne({raw: true, where: { id:id } });
    //     return response.render('tasks/edit', {task})
    //  }
    // //  002
    //  static async updateTask(request, response){
    //     const id = request.body.id
    //     const task = {
    //         title: request.body.title,
    //         description: request.body.description,
    //     }
    //     await Task.update(task, {where: {id:id}})
    //     return response.redirect('/tasks/all')
    //  }

    // //  Status da Tarefa
    // static async toggletaskStatus(request, response){
    //     const id = request.body.id
    //     const task = {
    //         done: request.body.done === '0' ? true : false
    //     }
    //     await Task.update(task, {where: {id:id}})
    //     return response.redirect('/tasks')
    // }
    
}
