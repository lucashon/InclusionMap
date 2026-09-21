<div align="center">

  <img src="public/assets/logo-integrador.png" alt="Inclusion Map Logo" width="120" />

  # 🗺️ Inclusion Map

  **Plataforma de mapeamento, inclusão e visibilidade para Pessoas com Deficiência (PCD) destinada à Gestão Municipal.**

  [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-executando-com-docker)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Sobre o Projeto

O **Inclusion Map** é uma solução web *open-source* e modular desenvolvida para auxiliar **Prefeituras e Órgãos Públicos** a darem voz, apoio e visibilidade às Pessoas com Deficiência (PCD).

A plataforma foi pensada para ser adotada por qualquer município, permitindo que os cidadãos se cadastrem, informem as suas necessidades de acessibilidade e contribuam para o mapeamento de demandas locais. Com isso, os gestores públicos obtêm indicadores valiosos para o direcionamento de recursos e a formulação de políticas públicas inclusivas.

### 🚀 Principais Funcionalidades
- 👤 **Registo e Perfil de Cidadãos**: Gestão individual de dados, contatos e necessidades específicas de acessibilidade.
- 📋 **Painel Administrativo (ADM)**: Visualização, filtragem e gestão completa de todos os cadastros do município.
- ♿ **Mapeamento de Demandas**: Diagnóstico rápido de barreiras e dificuldades enfrentadas na comunidade local.
- 🎨 **Interface Acessível e Responsiva**: Design adaptável para desktop e dispositivos móveis com componentes intuitivos.
- ⚙️ **Adaptável para Qualquer Município**: Estrutura pronta para personalização com a identidade visual da prefeitura contratante.

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express, Handlebars (Template Engine)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, FontAwesome
- **Containerização**: Docker, Docker Compose

---

## 🐳 Executando com Docker

### 🛠️ Pré-requisitos
Certifica-te de que tens as seguintes ferramentas instaladas no teu sistema:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/)

---

### 🚀 Passo a Passo

1. **Clona o repositório:**
   ```bash
  git clone https://github.com/lucashon/InclusionMap.git
  cd InclusionMap
  ```

2. **Inicia a aplicação e o banco de dados:**
  ```bash
  docker compose up --build
  ```

  O parâmetro `--build` recompila a imagem da aplicação quando necessário. Para iniciar os serviços em segundo plano, use:

  ```bash
  docker compose up --build -d
  ```

3. **Acessa a aplicação:**

  Abra [http://localhost:3001](http://localhost:3001) no navegador.

4. **Visualiza os logs:**
  ```bash
  docker compose logs -f app
  ```

5. **Para os containers:**
  ```bash
  docker compose down
  ```

  Para remover também os dados persistidos do banco, use `docker compose down -v`.

### 💻 Executando localmente sem Docker

Para executar a aplicação diretamente na máquina, é necessário ter o Node.js e um servidor MySQL instalados.

1. **Instala as dependências:**
  ```bash
  npm install
  ```

2. **Inicia a aplicação em modo de desenvolvimento:**
  ```bash
  npm run dev
  ```

  Para iniciar sem o Nodemon, use:

  ```bash
  npm start
  ```