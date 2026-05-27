# Resumo de Planejamento do Backend

Este documento consolida os pontos principais de planejamento tecnico do backend do CAIGE.

## 1. Entidades principais do sistema

- users
- permissions
- patients
- courses
- medical_records
- questions
- questionnaires
- questionnaire_questions
- questionnaire_responses
- activities
- professionals
- attendance (legado; no fluxo atual a presenca e derivada de questionnaire_responses)

## 2. Relacao entre as entidades

- users -> permissions: permissao por papel define acesso as rotas.
- users -> questions: um usuario cria perguntas.
- users -> questionnaires: um usuario cria prontuarios/questionarios.
- users -> medical_records: um usuario faz upload de prontuario.
- patients -> medical_records: um paciente possui varios prontuarios.
- patients -> questionnaire_responses: um paciente possui varias respostas de prontuario.
- questionnaires -> questions: relacao N para N via questionnaire_questions, com ordenacao.
- questionnaires -> questionnaire_responses: um questionario pode ter varias respostas.
- courses -> questions/questionnaires: curso organiza perguntas e prontuarios por area.
- activities: registra trilha de auditoria das acoes do sistema.
- attendance/reporting atual: historico, today e relatorios de frequencia sao derivados de questionnaire_responses.created_at + questionnaires.course.

## 3. Lista de endpoints planejados

### Autenticacao

- POST /api/auth/login
- POST /api/auth/change-password
- GET /api/auth/profile
- PUT /api/auth/profile

### Usuarios

- GET /api/users/profile
- GET /api/users/permissions
- GET /api/users
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Pacientes

- GET /api/patients
- GET /api/patients/:id
- POST /api/patients
- PUT /api/patients/:id
- DELETE /api/patients/:id

### Dashboard e atividades

- GET /api/dashboard-data
- GET /api/activities

### Frequencia (derivada de prontuario)

- GET /api/attendance/history
- GET /api/attendance/report
- GET /api/attendance/today

### Arquivamento

- GET /api/archive/users
- GET /api/archive/patients

### Prontuarios

- GET /api/medical-records/:patient_id
- POST /api/medical-records/:patient_id/upload
- DELETE /api/medical-records/:record_id
- GET /api/medical-records/:record_id/download

### Questionarios

- GET /api/questionnaires/questions/course/:course
- POST /api/questionnaires/questions
- PUT /api/questionnaires/questions/:id
- DELETE /api/questionnaires/questions/:id
- GET /api/questionnaires/questionnaires/course/:course
- POST /api/questionnaires/questionnaires
- PUT /api/questionnaires/questionnaires/:id
- PATCH /api/questionnaires/questionnaires/:id/publish
- DELETE /api/questionnaires/questionnaires/:id
- GET /api/questionnaires/questionnaires/:id/questions
- POST /api/questionnaires/responses
- GET /api/questionnaires/responses/:patientId/:questionnaireId

### Cursos

- GET /api/courses
- POST /api/courses
- PUT /api/courses/:id
- DELETE /api/courses/:id

## 4. Estrutura inicial do backend

Estrutura-base planejada para organizacao tecnica:

- Backend/src/server.js
  - inicializacao do servidor, middlewares globais e registro das rotas
- Backend/src/routes
  - definicao de endpoints por dominio
- Backend/src/controllers
  - regras de negocio e orquestracao das operacoes
- Backend/src/models
  - acesso a dados, funcoes utilitarias de schema, validacao e token
- Backend/database
  - scripts SQL de setup e migracoes
- Backend/uploads
  - armazenamento de arquivos de prontuario e imagens

Separacao por camadas:

- Route: recebe requisicao HTTP e aplica middlewares
- Controller: valida entrada, aplica regra e monta resposta
- Model: encapsula consulta e operacao no banco

Observacao de arquitetura:

- O controle de frequencia manual foi descontinuado.
- A presenca e calculada a partir de respostas de prontuario (questionnaire_responses), mantendo fonte unica de verdade para historico e relatorio.

## 5. Tecnologias utilizadas

### Backend

- Node.js
- Express
- MySQL
- mysql2
- jsonwebtoken (JWT)
- bcryptjs
- multer (upload de arquivos)
- dotenv

### Frontend

- HTML5
- CSS3
- JavaScript (vanilla)
- live-server (ambiente de desenvolvimento)

### Banco e scripts

- SQL (scripts de setup e migracoes em Backend/database)
