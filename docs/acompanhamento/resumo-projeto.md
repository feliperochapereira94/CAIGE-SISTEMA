# Resumo de Planejamento do Backend (Base Real do Projeto)

Este documento consolida os pontos principais do backend do CAIGE com base no estado atual do projeto.

## 1. Entidades principais do sistema

- usuarios
- permissoes
- profissionais
- cursos
- pacientes
- atividades
- frequencia
- perguntas
- questionarios
- questoes_questionarios
- respostas_questionarios
- estatisticas_rapidas

## 2. Relacao entre as entidades

- usuarios -> permissoes: permissao por papel define acesso as rotas.
- usuarios -> usuarios (criado_por): um usuario pode registrar outro usuario.
- usuarios -> perguntas: um usuario cria perguntas.
- usuarios -> questionarios: um usuario cria questionarios.
- pacientes -> frequencia: um paciente possui varios registros de frequencia.
- profissionais -> frequencia: o profissional registra/acompanha frequencia.
- questionarios -> perguntas: relacao N para N via questoes_questionarios (com ordem e status).
- pacientes -> respostas_questionarios: um paciente possui varias respostas.
- questionarios -> respostas_questionarios: um questionario pode ter varias respostas.
- cursos -> perguntas/questionarios: curso organiza perguntas e questionarios por area.
- atividades: registra trilha de auditoria das acoes do sistema.

## 3. Endpoints necessarios (reais no projeto)

### Autenticacao (`/api/autenticacao`)

- POST /api/autenticacao/entrar
- POST /api/autenticacao/alterar-senha
- GET /api/autenticacao/perfil
- PUT /api/autenticacao/perfil

### Usuarios (`/api/usuarios`)

- GET /api/usuarios/perfil
- GET /api/usuarios/permissoes
- GET /api/usuarios
- POST /api/usuarios
- PUT /api/usuarios/:id
- DELETE /api/usuarios/:id

### Pacientes (`/api/pacientes`)

- GET /api/pacientes
- GET /api/pacientes/:id
- POST /api/pacientes
- PUT /api/pacientes/:id
- DELETE /api/pacientes/:id

### Dashboard e atividades

- GET /api/dados-painel
- GET /api/atividades

### Frequencia (`/api/frequencia`)

- GET /api/frequencia/historico
- GET /api/frequencia/relatorio
- GET /api/frequencia/hoje

### Arquivamento (`/api/arquivo`)

- GET /api/arquivo/usuarios
- GET /api/arquivo/pacientes

### Questionarios (`/api/questionarios`)

- GET /api/questionarios/perguntas/curso/:curso
- POST /api/questionarios/perguntas
- PUT /api/questionarios/perguntas/:id
- DELETE /api/questionarios/perguntas/:id
- GET /api/questionarios/questionarios/curso/:curso
- POST /api/questionarios/questionarios
- PUT /api/questionarios/questionarios/:id
- PATCH /api/questionarios/questionarios/:id/publicar
- DELETE /api/questionarios/questionarios/:id
- GET /api/questionarios/questionarios/:id/perguntas
- POST /api/questionarios/respostas
- GET /api/questionarios/respostas/:idPaciente/:idQuestionario

### Cursos (`/api/cursos`)

- GET /api/cursos
- POST /api/cursos
- PUT /api/cursos/:id
- DELETE /api/cursos/:id

## 4. Estrutura atual do backend

- Backend/src/server.js
	- inicializacao do servidor, middlewares globais e registro das rotas
- Backend/src/routes
	- definicao dos endpoints por dominio
- Backend/src/controllers
	- regras de negocio e orquestracao das operacoes
- Backend/src/models
	- acesso a dados, validacoes e utilitarios
- Backend/database
	- scripts SQL de setup

Separacao por camadas:

- Route: recebe requisicao HTTP e aplica middlewares
- Controller: valida entrada, aplica regra e monta resposta
- Model: encapsula consulta e operacao no banco

Observacao de arquitetura:

- Nao existe modulo de upload de anexos no backend atual.
- O projeto usa controle por autenticacao + permissao por papel/permissoes.

## 5. Tecnologias utilizadas

### Backend

- Node.js
- Express
- MySQL
- mysql2
- jsonwebtoken (JWT)
- bcryptjs
- dotenv

### Frontend

- HTML5
- CSS3
- JavaScript (vanilla)
- live-server (ambiente de desenvolvimento)

### Banco e scripts

- SQL (scripts de setup em Backend/database)
