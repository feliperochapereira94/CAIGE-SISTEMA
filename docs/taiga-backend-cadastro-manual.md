# Taiga sem importação CSV

Este arquivo foi montado para cadastro manual no Taiga quando a importação CSV não está disponível.

## Estrutura do projeto no Taiga

1. Crie os épicos:
- BACKEND
- FRONTEND
- BANCO DE DADOS

2. Neste momento, alimente apenas o épico BACKEND.
3. Em cada história, cole os critérios de aceite na descrição.
4. Em seguida, crie as tarefas técnicas dentro da própria história.

## Histórias de Usuário do BACKEND

### US-01 - Login com JWT
Epic: BACKEND
Sprint: Sprint 1
Story Points: 3
Prioridade: Alta

Como usuário autenticável, quero receber token JWT no login, para acessar rotas protegidas.

Descrição detalhada:
Esta história cobre a base de autenticação da API, garantindo que o processo de login seja seguro, previsível e padronizado para o frontend. O objetivo é validar credenciais, emitir token com expiração e retornar dados mínimos necessários para manter a sessão ativa. Também faz parte do escopo registrar o último acesso do usuário para auditoria básica e rastreabilidade de uso do sistema.

Critérios de aceite:
- Dado credenciais válidas quando chamar endpoint de login então retorna token JWT e expiração.
- Dado credenciais inválidas quando chamar endpoint de login então retorna 401.

Tarefas técnicas:
- Implementar/ajustar rota POST /api/auth/login (arquivo: Backend/src/routes/auth.js).
- Implementar validação de credenciais no método login (arquivo: Backend/src/controllers/authController.js).
- Gerar accessToken JWT com expiração e payload mínimo do usuário (arquivo: Backend/src/controllers/authController.js).
- Atualizar campo de último acesso no banco ao autenticar com sucesso (arquivos: Backend/src/controllers/authController.js e Backend/src/models/tokenModel.js ou model equivalente).

### US-02 - Autorização por perfil
Epic: BACKEND
Sprint: Sprint 1
Story Points: 5
Prioridade: Alta

Como administrador, quero controlar acesso por perfil e permissão, para proteger recursos sensíveis.

Descrição detalhada:
Esta história define as regras de autorização por perfil no backend, evitando acesso indevido a endpoints administrativos e operações críticas. O foco é criar uma camada única de verificação de permissão por rota, permitindo evolução das regras sem alterar cada controller manualmente. Com isso, o sistema reduz risco de exposição de dados e melhora a governança de acesso entre diferentes tipos de usuário.

Critérios de aceite:
- Dado usuário sem permissão quando acessar rota restrita então retorna 403.
- Dado usuário com permissão quando acessar rota restrita então retorna 200.

Tarefas técnicas:
- Ajustar middleware requireAuth e requirePermission (arquivo: Backend/src/controllers/accessController.js).
- Aplicar requirePermission nas rotas protegidas (arquivos: Backend/src/routes/patients.js e Backend/src/routes/medical-records.js).
- Criar ou consolidar mapa de permissão por endpoint e método HTTP (arquivo: Backend/src/controllers/accessController.js).
- Validar respostas 403/200 com testes de cenários de permissão (arquivos: pasta de testes de integração do Backend).

### US-03 - Perfil do usuário autenticado
Epic: BACKEND
Sprint: Sprint 1
Story Points: 2
Prioridade: Alta

Como usuário logado, quero consultar meu perfil, para confirmar meus dados de acesso.

Descrição detalhada:
Esta história garante que o usuário autenticado consiga recuperar seus dados de identificação e contexto de acesso logo após o login. O retorno deve incluir informações relevantes de perfil para suportar regras de interface e permissões no frontend, como papel e nível de acesso. Também contempla tratamento consistente para token inválido ou expirado, mantendo padrão de resposta da API.

Critérios de aceite:
- Dado usuário autenticado quando consultar perfil então retorna dados corretos.
- Dado token inválido quando consultar perfil então retorna erro de autenticação.

Tarefas técnicas:
- Ajustar rota GET /api/auth/profile com requireAuth (arquivo: Backend/src/routes/auth.js).
- Implementar retorno de perfil no método getUserProfile (arquivo: Backend/src/controllers/authController.js).
- Tratar token ausente, inválido e expirado com resposta padronizada (arquivos: Backend/src/controllers/accessController.js e Backend/src/controllers/authController.js).

### US-04 - Cadastro e atualização de pacientes
Epic: BACKEND
Sprint: Sprint 2
Story Points: 5
Prioridade: Alta

Como profissional, quero cadastrar e atualizar pacientes com dados válidos, para manter prontuário consistente.

Descrição detalhada:
Esta história concentra as operações de entrada e manutenção de dados cadastrais de pacientes, com validações obrigatórias no backend para preservar integridade do banco. O objetivo é evitar inconsistências que impactem prontuário, relatórios e consultas futuras. Inclui regras de validação, padronização de erros de negócio e estrutura de resposta uniforme para facilitar uso pela camada de frontend.

Critérios de aceite:
- Dado payload válido quando salvar paciente então persiste registro.
- Dado payload inválido quando salvar paciente então retorna 400 com validações.

Tarefas técnicas:
- Ajustar rotas POST /api/patients e PUT /api/patients/:id (arquivo: Backend/src/routes/patients.js).
- Implementar validações de payload no controller de pacientes (arquivo: Backend/src/controllers/patientController.js).
- Persistir create/update com queries parametrizadas no fluxo atual (arquivos: Backend/src/controllers/patientController.js e Backend/src/models/database.js).
- Retornar erros 400/404 padronizados para entrada inválida e paciente inexistente (arquivo: Backend/src/controllers/patientController.js).

### US-05 - Listagem paginada de pacientes
Epic: BACKEND
Sprint: Sprint 2
Story Points: 3
Prioridade: Alta

Como usuário autorizado, quero listar pacientes com paginação e busca, para localizar registros rapidamente.

Descrição detalhada:
Esta história trata da consulta de pacientes com desempenho e usabilidade, permitindo buscar registros por filtros e navegar por páginas de resultados. O backend deve responder com metadados de paginação para apoiar listagens grandes sem perda de performance. O escopo inclui filtros por campos principais de identificação, além de validação de parâmetros para evitar consultas inválidas.

Critérios de aceite:
- Dado parâmetros de página quando listar pacientes então retorna paginação correta.
- Dado filtro por nome ou documento quando buscar então retorna itens filtrados.

Tarefas técnicas:
- Ajustar rota GET /api/patients para receber page, limit e search (arquivo: Backend/src/routes/patients.js).
- Implementar query paginada com limit/offset no fluxo atual de listagem (arquivos: Backend/src/controllers/patientController.js e Backend/src/models/database.js).
- Implementar filtro por nome e documento na mesma consulta (arquivo: Backend/src/controllers/patientController.js).
- Retornar metadados (page, limit, total, totalPages) na resposta (arquivo: Backend/src/controllers/patientController.js).

### US-06 - Presença derivada de respostas de prontuário
Epic: BACKEND
Sprint: Sprint 3
Story Points: 5
Prioridade: Alta

Como profissional, quero que a presença seja derivada automaticamente das respostas do prontuário, para evitar registro manual paralelo.

Descrição detalhada:
Esta história substitui o controle de frequência manual por um modelo derivado exclusivamente de respostas de questionário (prontuário). Cada envio em questionnaire_responses passa a representar uma presença, com data/hora de criação e curso associado ao questionário. O objetivo é eliminar dupla escrita e manter rastreabilidade direta entre resposta clínica e presença registrada.

Critérios de aceite:
- Dado envio válido de resposta de prontuário quando salvar então a presença deve aparecer no histórico de frequência.
- Dado consulta de presença do dia quando chamar endpoint apropriado então a API deve retornar itens derivados de questionnaire_responses.
- Dado filtro por curso quando consultar histórico então a API deve retornar somente itens do curso informado.

Tarefas técnicas:
- Ajustar leitura de presença para derivar de questionnaire_responses + questionnaires.course (arquivo: Backend/src/controllers/attendanceController.js).
- Confirmar ausência de endpoint manual POST /api/attendance/register e manter apenas rotas de leitura (arquivo: Backend/src/routes/attendance.js).
- Validar paginação e filtros patient_id, start_date, end_date e course no histórico (arquivo: Backend/src/controllers/attendanceController.js).
- Garantir retorno de timestamp e curso em attendance_records no relatório (arquivo: Backend/src/controllers/attendanceController.js).

### US-07 - Relatório de presença derivado de prontuário
Epic: BACKEND
Sprint: Sprint 3
Story Points: 5
Prioridade: Alta

Como coordenador, quero gerar relatório de presença por período, para visualizar em quais dias cada paciente esteve no projeto.

Descrição detalhada:
Esta história define a geração de relatórios de presença a partir de questionnaire_responses, sem qualquer registro manual de frequência. O backend deve permitir consulta por intervalo de datas, paciente e curso, retornando dias presentes, total de entradas e detalhes com data/hora e curso. O resultado esperado é apoiar acompanhamento de participação no projeto com fonte única de verdade.

Critérios de aceite:
- Dado período válido quando consultar relatório então retorna dias presentes e total de entradas por paciente.
- Dado período sem registros quando consultar relatório então retorna lista vazia com metadados.
- Dado usuário sem permissão can_view_reports quando consultar relatório então retorna 403.

Tarefas técnicas:
- Expor relatório em GET /api/attendance/report com requirePermission(can_view_reports) (arquivo: Backend/src/routes/attendance.js).
- Implementar agregação por período usando DATE(questionnaire_responses.created_at) (arquivo: Backend/src/controllers/attendanceController.js).
- Incluir attendance_records com timestamp e course no payload final (arquivo: Backend/src/controllers/attendanceController.js).
- Implementar e validar filtros opcionais por patient_id, patient_name e course (arquivo: Backend/src/controllers/attendanceController.js).

### US-09 - Criar e manter perguntas dos prontuários
Epic: BACKEND
Sprint: Sprint 4
Story Points: 5
Prioridade: Alta

Como profissional responsável pelo curso, quero criar, editar e desativar perguntas, para montar prontuários padronizados por área.

Descrição detalhada:
Esta história cobre o cadastro das perguntas que serão utilizadas nos prontuários de cada curso. O backend deve permitir diferentes tipos de pergunta (texto livre, múltipla escolha, sim/não e escala), validando formato e opções quando necessário. Também deve aplicar controle de permissão por usuário/curso para garantir que somente perfis autorizados alterem as perguntas.

Critérios de aceite:
- Dado payload válido quando criar pergunta então a API salva e retorna o registro criado.
- Dado tipo de pergunta inválido quando criar pergunta então a API retorna 400.
- Dado usuário sem permissão quando editar/deletar pergunta então a API retorna 403.

Tarefas técnicas:
- Ajustar/listar endpoint de perguntas por curso (rota GET /api/questionnaires/questions/course/:course) (arquivo: Backend/src/routes/questionnaires.js).
- Implementar criação de pergunta com validação de question_type e options (rota POST /api/questionnaires/questions) (arquivo: Backend/src/controllers/questionnaireController.js).
- Implementar edição e soft delete de perguntas (rotas PUT/DELETE /api/questionnaires/questions/:id) (arquivo: Backend/src/controllers/questionnaireController.js).
- Garantir checagem de permissões por curso e perfil (arquivo: Backend/src/controllers/questionnaireController.js).

### US-10 - Montar prontuário com perguntas
Epic: BACKEND
Sprint: Sprint 4
Story Points: 5
Prioridade: Alta

Como profissional responsável, quero criar prontuários com conjunto de perguntas e ordem definida, para padronizar a aplicação por curso.

Descrição detalhada:
Esta história trata da criação e manutenção da estrutura do prontuário (questionnaire), vinculando perguntas previamente cadastradas. O backend deve permitir adicionar, remover, reordenar e publicar prontuários, preservando integridade da estrutura e impedindo publicação sem perguntas ativas. Também deve permitir consulta das perguntas de um prontuário para aplicação no atendimento.

Critérios de aceite:
- Dado prontuário com perguntas válidas quando criar então a estrutura é salva com ordenação.
- Dado tentativa de publicar prontuário sem perguntas ativas então a API retorna 400.
- Dado prontuário existente quando consultar perguntas então a API retorna lista ordenada.

Tarefas técnicas:
- Implementar criação de prontuário com vínculo de perguntas (rota POST /api/questionnaires/questionnaires) (arquivos: Backend/src/routes/questionnaires.js e Backend/src/controllers/questionnaireController.js).
- Implementar atualização de prontuário com reordenação e ativação/desativação de vínculos (rota PUT /api/questionnaires/questionnaires/:id) (arquivo: Backend/src/controllers/questionnaireController.js).
- Implementar publicação com validação de pelo menos uma pergunta ativa (rota PATCH /api/questionnaires/questionnaires/:id/publish) (arquivo: Backend/src/controllers/questionnaireController.js).
- Implementar listagem por curso e consulta de perguntas por prontuário (rotas GET /api/questionnaires/questionnaires/course/:course e GET /api/questionnaires/questionnaires/:id/questions) (arquivo: Backend/src/controllers/questionnaireController.js).

### US-11 - Salvar respostas do prontuário do paciente
Epic: BACKEND
Sprint: Sprint 4
Story Points: 5
Prioridade: Alta

Como profissional autorizado, quero salvar as respostas do prontuário do paciente e consultar o histórico, para acompanhar evolução clínica e registros aplicados.

Descrição detalhada:
Esta história cobre o envio e persistência das respostas de um prontuário para um paciente específico. O backend deve validar os dados de entrada, gerar snapshot das perguntas no momento da resposta e armazenar histórico para consultas futuras. Também deve disponibilizar endpoint de recuperação das respostas por paciente e prontuário, ordenadas por data.

Critérios de aceite:
- Dado patientId, questionnaireId e responses válidos quando salvar então a API cria o registro de resposta.
- Dado payload incompleto quando salvar resposta então a API retorna 400.
- Dado paciente e prontuário válidos quando consultar histórico então a API retorna respostas em ordem decrescente de data.

Tarefas técnicas:
- Implementar endpoint de salvar respostas (rota POST /api/questionnaires/responses) (arquivos: Backend/src/routes/questionnaires.js e Backend/src/controllers/questionnaireController.js).
- Validar patientId, questionnaireId e responses no controller antes de persistir (arquivo: Backend/src/controllers/questionnaireController.js).
- Montar e persistir snapshot de perguntas + respostas em questionnaire_responses (arquivo: Backend/src/controllers/questionnaireController.js).
- Implementar endpoint de histórico por paciente e prontuário (rota GET /api/questionnaires/responses/:patientId/:questionnaireId) (arquivo: Backend/src/controllers/questionnaireController.js).

### US-08 - Padronizar erros e testes de rotas críticas
Epic: BACKEND
Sprint: Sprint 4
Story Points: 5
Prioridade: Média

Como consumidor da API, quero erros padronizados e cobertura básica de testes, para facilitar integração e reduzir regressão.

Descrição detalhada:
Esta história formaliza a qualidade técnica mínima do backend por meio de padronização de erros e testes de integração nas rotas mais críticas. O objetivo é reduzir comportamento inconsistente entre endpoints, facilitar depuração e aumentar confiança em manutenções futuras. Inclui definição de contrato único de erro e validação automatizada de fluxos centrais, como autenticação, pacientes e prontuário.

Critérios de aceite:
- Dado erro de negócio quando ocorrer então retorna estrutura única de erro.
- Dado execução de testes quando rodar suite então cenários críticos de auth pacientes e prontuário passam.

Tarefas técnicas:
- Refatorar middleware global de erro no server para contrato único (code, message, details) (arquivo: Backend/src/server.js).
- Padronizar throw/return de erros em controllers críticos (arquivos: Backend/src/controllers/authController.js, Backend/src/controllers/patientController.js, Backend/src/controllers/medicalRecordsController.js).
- Criar testes de integração para /api/auth/login, /api/patients e rotas de prontuário (arquivos: pasta de testes do Backend).
- Documentar execução de testes e critérios mínimos de aprovação (arquivo: docs/08-testes.md).

## Roteiro rápido para cadastrar no Taiga

1. Crie os 3 épicos (BACKEND, FRONTEND, BANCO DE DADOS).
2. Entre no épico BACKEND.
3. Crie as 11 histórias acima com título e descrição.
4. Em cada história, cadastre as tarefas técnicas.
5. Atribua sprint, prioridade e story points conforme este arquivo.

## Checklist para apresentação (Planejado x Entregue)

### O que deverá ser planejado

1. Entidades principais do sistema.
- Planejamento recomendado: users, permissions, patients, medical_records, questions, questionnaires, questionnaire_questions, questionnaire_responses, courses, activities.

2. Relação entre as entidades.
- Planejamento recomendado: paciente possui prontuários e respostas; prontuário é composto por perguntas; questionário se relaciona com perguntas pela tabela de vínculo; usuário cria e gerencia perguntas/questionários conforme permissão.

3. Endpoints necessários.
- Planejamento recomendado: autenticação, pacientes, prontuários, perguntas, questionários, respostas e relatórios.

4. Estrutura inicial do backend.
- Planejamento recomendado: server, routes, controllers, models, database.

5. Tecnologias utilizadas.
- Planejamento recomendado: Node.js, Express, MySQL, mysql2, dotenv, bcryptjs.

6. Atualização do Taiga.
- Planejamento recomendado: cadastrar épicos e histórias por prioridade, com tarefas técnicas acionáveis.

7. Atualização do GitHub.
- Planejamento recomendado: versionar documentação e backlog, registrar commits e evidências no repositório.

### O que deverá ser entregue

1. Entidades principais do sistema.
- Evidência no projeto: [04-banco-de-dados.md](04-banco-de-dados.md) e [../BANCO_DE_DADOS.md](../BANCO_DE_DADOS.md).

2. Relação entre as entidades.
- Evidência no projeto: [04-banco-de-dados.md](04-banco-de-dados.md).

3. Lista de endpoints planejados.
- Evidência no projeto: [05-api.md](05-api.md), [../Backend/src/server.js](../Backend/src/server.js), [../Backend/src/routes](../Backend/src/routes).

4. Estrutura inicial do backend.
- Evidência no projeto: [../Backend/ESTRUTURA.md](../Backend/ESTRUTURA.md) e [03-arquitetura.md](03-arquitetura.md).

5. Tecnologias utilizadas.
- Evidência no projeto: [../Backend/package.json](../Backend/package.json) e [../Backend/ESTRUTURA.md](../Backend/ESTRUTURA.md).

6. Links atualizados do Taiga e GitHub.
- Entrega esperada em apresentação: link do projeto Taiga atualizado e link do repositório GitHub atualizado.
- Status atual deste arquivo: pendente de preenchimento manual dos links finais.

7. Evidências das atualizações realizadas.
- Evidência no projeto: [taiga-backend-cadastro-manual.md](taiga-backend-cadastro-manual.md), [taiga-backend-backlog.csv](taiga-backend-backlog.csv).
- Evidência de código relacionado: [../Backend/src/routes/questionnaires.js](../Backend/src/routes/questionnaires.js), [../Backend/src/controllers/questionnaireController.js](../Backend/src/controllers/questionnaireController.js), [../Backend/src/routes/attendance.js](../Backend/src/routes/attendance.js), [../Backend/src/controllers/attendanceController.js](../Backend/src/controllers/attendanceController.js).

### Status rápido do arquivo do Taiga

- Correto para backlog de desenvolvimento backend: sim.
- Pontos fortes: histórias detalhadas, critérios de aceite, tarefas técnicas com arquivos-alvo, ordem por prioridade.
- Ajuste recomendado para banca: incluir no Taiga uma seção de links (Taiga/GitHub) e anexar evidências visuais (prints dos cards e histórico de atualização).
