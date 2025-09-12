<img src="client/src/assets/logotipocintoniarosa.png" alt="Logotipo do CIntonia" width="200"/>

# CIntonia

CIntonia é uma plataforma de avaliação de músicas desenvolvida para a disciplina de **Engenharia de Software e Sistemas (IF682)** do CIn-UFPE, no curso de Engenharia da Computação. Este repositório contém tanto o **backend** quanto o **frontend** da aplicação.

## 📑 Índice 
- [Visão Geral](#-visão-geral)
- [Equipe](#-equipe)
- [Tecnologias Utilizadas](#%EF%B8%8F-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração e Instalação](#%EF%B8%8F-configuração-e-instalação)

## 🔎 Visão geral
Este projeto é um sistema de gerenciamento de reviews, permitindo as seguintes features:
- Usuários comuns e administradores
- Seguir/deixar de seguir usuários
- Cadastrar, editar e deletar músicas e reviews
- Buscar músicas e usuários
- Gerenciar usuários
  - Reportar e ocultar reviews de um usuário
  - Suspender e deletar contas
  - Enviar advertências

### 👥 Tipos de usuário
#### Comum
O usuário comum é aquele que pode buscar músicas/usuários, criar/editar/deletar/reportar reviews, seguir e deixar de seguir os demais usuários.
#### Administrador
O usuário administrador possui todas as permissões do usuário comum, além de cadastrar/editar/deletar músicas e de suspender/deletar outros usuários.

## 👨‍💻 Equipe
- Andreywid Yago Lima de Souza (ayls)
- Carolina Gabriela de Arruda Brito dos Santos (cgabs)
- Karina Lima de Oliveira (klo)
- Luiz Gustavo Santa Cruz Silva Segundo (lgscss)
- Manoel David de Medeiros da Silva (mdms)
- Túlio Fernando Carvalho de Lira (tfcl)

## 🛠️ Tecnologias utilizadas
### Back-End
- Node.js, Express e JavaScript
- MongoDB

### Front-End
- React, NextJS e JavaScript

### Testes
- Jest-Cucumber
- Cypress

### Outras Ferramentas
- Gerenciamento de Projetos: Notion
- Design: Canva e Excalidraw
- Comunicação: Discord e WhatsApp

## 📂 Estrutura do projeto
- **server:** Contém o código fonte do backend da aplicação.
  - `controllers/`: tratam requisições HTTP
  - `models/`: definem a estrutura dos dados
  - `routes/`: rotas da API 
  - `services/`: lógica de negócio
 
- **client:** Contém o código fonte do frontend da aplicação, responsável pela interface e experiência do usuário.

## ⚙️ Configuração e Instalação
### Pré-requisitos
- Node.js
- MongoDB
### Passos de instalação
1. Clone o repositório:
   
   ```
   git clone https://github.com/manoeldavid/ess-project-1.git
   cd ess-project-1
   ```
3. Configure e inicie o backend:
   
   ```
   cd server
   npm install
   ```
   ```
   node index.js
   ```
5. Configure e inicie o frontend:
   
   - Abra um novo terminal na pasta raiz do projeto.
  
   ```
   cd client
   npm install
   ```
   ```
   npm start
   ```
### Configuração do Banco de Dados
Certifique-se de que o arquivo ```.env``` da pasta ```/server``` está funcionando. Caso não, crie um arquivo ```.env``` com:
```
JWT_SECRET = "sua_chave_secreta_super_segura_aqui"
NODE_ENV = "development"
MONGO_DB_URI="mongodb+srv://<SEU_USUARIO>:<SUA_SENHA>@seu_cluster_url/nome_do_banco?retryWrites=true&w=majority"
```
