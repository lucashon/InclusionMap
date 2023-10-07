// retornando informações no html:
// Página De todos os cadastrados
    const mostrarBasic = document.getElementsByClassName('show')[0]
    
    async function Show(){
        mostrarBasic.innerHTML =  `<a href="/inclusion/dados">Voltar</a>
        <h1>Todos os Cadastros:</h1>`

        console.log(error)
    }
  Show()

//   Pagina de Visão geral
  const mostrarBasic2 = document.getElementsByClassName('show2')[0]
    
  async function Show2(){
      mostrarBasic2.innerHTML =  `<a href="/">Voltar</a>`

      console.log(error)
  }
Show2()

// Sobre nos no Home

const showWe = document.getElementsByClassName('showWe')[0]

async function mostrarNos(){
    showWe.innerHTML = `<div>
    <div class="container-nos">
      <div>
     <h1>Quem somos</h1>
         <p>
         Somos uma plataforma dedicada a dar voz e visibilidade às pessoas com deficiência (PCD) na cidade de
         Jaraguá do Sul. Acreditamos na importância de promover a inclusão e melhorar a qualidade de vida das
         PCDs em nossa comunidade. 
           Nosso principal objetivo é criar um espaço onde PCDs possam se cadastrar, compartilhar suas experiências
         e necessidades, e se conectarem com recursos e oportunidades disponíveis em nossa cidade. Estamos
         empenhados em facilitar a gestão do estado ao mapear as demandas e desafios enfrentados pelas PCDs,
         proporcionando informações valiosas para políticas públicas e iniciativas de inclusão.
         
     </p>
      </div>
     <img src="/assets/inicio.webp" alt="" width="900px" height="500px">
    </div>
 </div>`
}
mostrarNos()
