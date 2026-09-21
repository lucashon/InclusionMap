// Página Administrativa: Listagem de todos os cadastrados
const mostrarBasic = document.getElementsByClassName('show')[0];

async function Show() {
    if (!mostrarBasic) return;

    try {
        // Exemplo de lista de cadastros (substitua pela requisição da sua API caso utilize fetch/axios)
        const cadastros = [
            {
                id: 1,
                nome: "Lucas e",
                deficiencia: "noa tenho",
                foto: "/assets/perfiltodos.png"
            }
        ];

        let htmlContent = `
        <div class="page-container">
            <header class="page-header">
                <a href="/inclusion/dados" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Voltar
                </a>
                <h1 class="page-title">Todos os Cadastros:</h1>
            </header>
            
            <section class="cards-grid">
        `;

        cadastros.forEach(item => {
            htmlContent += `
                <div class="user-card">
                    <div class="user-card-accent"></div>
                    <div class="user-card-body">
                        
                        <div class="user-avatar-container">
                            <img src="${item.foto}" alt="Foto de ${item.nome}" class="user-avatar">
                        </div>

                        <div class="user-info">
                            <h3 class="user-name">${item.nome}</h3>
                            <div class="user-detail-badge">
                                <i class="fa-solid fa-universal-access"></i>
                                <span><strong>Deficiência:</strong> ${item.deficiencia}</span>
                            </div>
                        </div>

                        <div class="user-card-actions">
                            <a href="/inclusion/perfil/${item.id}" class="btn-card-action btn-outline" title="Mais Informações">
                                <i class="fa-solid fa-circle-info"></i> Mais Info
                            </a>
                            <a href="/inclusion/login/${item.id}" class="btn-card-action btn-solid" title="Login">
                                <i class="fa-solid fa-right-to-bracket"></i> Login
                            </a>
                        </div>

                    </div>
                </div>
            `;
        });

        htmlContent += `
            </section>
        </div>
        `;

        mostrarBasic.innerHTML = htmlContent;

    } catch (err) {
        console.error("Erro ao renderizar cadastros:", err);
    }
}
Show();

// Pagina de Visão geral
const mostrarBasic2 = document.getElementsByClassName('show2')[0];
async function Show2() {
    if (!mostrarBasic2) return;
    mostrarBasic2.innerHTML = `<a href="/">Voltar</a>`;
}
Show2();

// Sobre nós na Home
const showWe = document.getElementsByClassName('showWe')[0];
async function mostrarNos() {
    if (!showWe) return;
    showWe.innerHTML = `<div>
        <div class="container-nos">
            <div>
                <h1>Quem somos</h1>
                <p>
                    Somos uma plataforma dedicada a dar voz e visibilidade às pessoas com deficiência (PCD) na cidade de
                    Jaraguá do Sul. Acreditamos na importância de promover a inclusão e melhorar a qualidade de vida das
                    PCDs em nossa comunidade. 
                    Nosso principal objetivo é criar um espaço onde PCDs possam se cadastrar, compartilhar suas experiências
                    e necessidades, e se conectarem com recursos e oportunidades disponíveis em nossa cidade.
                </p>
            </div>
            <img src="/assets/inicio.webp" alt="" width="900px" height="500px">
        </div>
    </div>`;
}
mostrarNos();

// Botões de Ação do Perfil
const voltar = document.getElementsByClassName('showVoltar')[0];
const excluir = document.getElementsByClassName('showExcluir')[0];
const editar = document.getElementsByClassName('showEditar')[0];

async function showVoltar() {
    if (voltar) {
        voltar.innerHTML = `<div class="center">
            <button class="btn">
                <svg width="180px" height="60px" viewBox="0 0 180 60" class="border">
                    <polyline points="179,1 179,59 1,59 1,1 179,1" class="bg-line" />
                    <polyline points="179,1 179,59 1,59 1,1 179,1" class="hl-line" />
                </svg>
                <span>Voltar</span>
            </button>
        </div>`;
    }

    if (excluir) {
        excluir.innerHTML = `<div class="center excluir">
            <button class="btn">
                <svg width="180px" height="60px" viewBox="0 0 180 60" class="border">
                    <polyline points="179,1 179,59 1,59 1,1 179,1" class="bg-line" />
                    <polyline points="179,1 179,59 1,59 1,1 179,1" class="hl-line" />
                </svg>
                <span>Excluir</span>
            </button>
        </div>`;
    }
}
showVoltar();

async function showedit() {
    if (!editar) return;
    editar.innerHTML = `<div class="center excluir">
        <button class="btn">
            <svg width="180px" height="60px" viewBox="0 0 180 60" class="border">
                <polyline points="179,1 179,59 1,59 1,1 179,1" class="bg-line" />
                <polyline points="179,1 179,59 1,59 1,1 179,1" class="hl-line" />
            </svg>
            <span>Editar</span>
        </button>
    </div>`;
}
showedit();

const senao = document.getElementById('show-else');
async function showElse() {
    if (!senao) return;
    senao.innerHTML = `<span>Dificuldades:</span> Esse cidadão não possui dificuldades ou elas já foram resolvidas`;
}
showElse();