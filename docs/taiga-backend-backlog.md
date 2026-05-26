# Backlog de Backend para Taiga

Este backlog foi organizado para representar entregas incrementais do backend, com cards prontos para copiar no Taiga sem depender de importacao por CSV.

## Como usar

- Crie um epic por area funcional.
- Copie cada bloco de historia para um card do Taiga.
- Mantenha o status como `New`, `Ready`, `In progress`, `Review` e `Done` conforme a evolucao real.
- Se o avaliador pedir o historico, mostre a sequencia por sprint em vez de apenas o produto final.

## Sprint 1 - Base de acesso e estrutura de dados

### EPIC: Autenticacao e autorizacao

#### US-01 - Validar login do usuario
Como usuario autenticavel, quero entrar no sistema com email e senha, para acessar a area protegida.

Critérios de aceite:
- Dado email e senha validos, quando eu enviar o login, entao a autenticacao deve ser aceita.
- Dado credenciais invalidas, quando eu tentar entrar, entao devo receber erro 401 com mensagem padronizada.
- Dado login valido, quando a resposta voltar, entao os dados basicos do usuario devem ser exibidos.

Tarefas tecnicas:
- Revisar controller de login.
- Padronizar mensagens de erro.
- Garantir registro de ultimo acesso.

Estimativa: 3 pontos

#### US-02 - Proteger rotas por permissao
Como administrador do sistema, quero controlar quais perfis acessam cada rota, para reduzir acesso indevido.

Critérios de aceite:
- Dado um usuario sem permissao, quando acessar rota restrita, entao deve receber 403.
- Dado um usuario com permissao, quando acessar rota restrita, entao a requisicao deve ser liberada.
- Dado um perfil diferente, quando mudar a regra de acesso, entao o middleware deve respeitar a nova permissao.

Tarefas tecnicas:
- Revisar middleware de autenticacao.
- Consolidar verificacao de permissoes.
- Testar rotas criticas.

Estimativa: 5 pontos

### EPIC: Gestao de usuarios

#### US-03 - Consultar perfil do usuario autenticado
Como usuario logado, quero ver meu perfil, para confirmar meus dados e meu papel no sistema.

Critérios de aceite:
- Dado um usuario autenticado, quando consultar o perfil, entao o backend deve retornar os dados corretos.
- Dado um usuario sem contexto valido, quando consultar o perfil, entao deve haver resposta de erro adequada.

Tarefas tecnicas:
- Revisar endpoint de perfil.
- Validar retorno de role, setor e curso.
- Garantir tratamento de erro quando nao houver usuario.

Estimativa: 2 pontos

### EPIC: Estrutura tecnica

#### US-04 - Padronizar respostas de erro da API
Como consumidor da API, quero receber erros padronizados, para facilitar integracao e manutencao.

Critérios de aceite:
- Dado qualquer erro de validacao, quando ocorrer, entao o retorno deve seguir o mesmo formato.
- Dado qualquer erro interno, quando ocorrer, entao a API deve responder com estrutura previsivel.
- Dado erro em rota protegida, quando ocorrer, entao o codigo HTTP deve ser coerente.

Tarefas tecnicas:
- Criar middleware global de erro.
- Revisar validacoes dos controllers.
- Uniformizar mensagens e codigos HTTP.

Estimativa: 3 pontos

## Sprint 2 - Pacientes e prontuario

### EPIC: Gestao de pacientes

#### US-05 - Cadastrar paciente com validacao
Como profissional da equipe, quero cadastrar pacientes com dados validos, para manter o banco consistente.

Critérios de aceite:
- Dado um payload valido, quando cadastrar paciente, entao o registro deve ser salvo.
- Dado um payload incompleto, quando cadastrar paciente, entao a API deve retornar 400.
- Dado CPF ou documento invalido, quando cadastrar paciente, entao a validacao deve bloquear o envio.

Tarefas tecnicas:
- Revisar validacoes do controller.
- Ajustar mensagens de erro.
- Conferir persistencia no banco.

Estimativa: 5 pontos

#### US-06 - Listar pacientes com filtros e paginacao
Como usuario autorizado, quero listar pacientes de forma paginada, para localizar registros rapidamente.

Critérios de aceite:
- Dado um conjunto grande de pacientes, quando consultar a lista, entao a resposta deve vir paginada.
- Dado um nome ou documento informado, quando buscar, entao os resultados devem ser filtrados.
- Dado pagina ou limite invalido, quando consultar, entao a API deve tratar a entrada.

Tarefas tecnicas:
- Implementar limit e offset.
- Adicionar filtro por nome e documento.
- Retornar metadados de pagina.

Estimativa: 3 pontos

#### US-07 - Atualizar dados do paciente
Como profissional da equipe, quero atualizar o cadastro do paciente, para manter as informacoes sempre corretas.

Critérios de aceite:
- Dado um paciente existente, quando atualizar dados validos, entao o registro deve ser alterado.
- Dado um paciente inexistente, quando tentar atualizar, entao a API deve retornar 404.
- Dado campo invalido, quando enviar a alteracao, entao deve ocorrer validacao adequada.

Tarefas tecnicas:
- Revisar endpoint de edicao.
- Validar existencia do paciente.
- Padronizar resposta de sucesso.

Estimativa: 3 pontos

### EPIC: Arquivamento e historico

#### US-08 - Organizar arquivamento de registros
Como supervisor, quero consultar registros arquivados, para manter o historico do sistema.

Critérios de aceite:
- Dado um usuario supervisor, quando consultar arquivos, entao deve visualizar registros arquivados.
- Dado um usuario sem permissao, quando acessar, entao deve receber 403.
- Dado filtro por tipo, quando consultar, entao a listagem deve respeitar o contexto.

Tarefas tecnicas:
- Revisar rotas de arquivamento.
- Garantir controle de permissao.
- Testar listagens de usuarios e pacientes.

Estimativa: 3 pontos

## Sprint 3 - Frequencia, atividades e cursos

### EPIC: Frequencia e atividades

#### US-09 - Derivar frequencia por respostas de prontuario
Como instrutor, quero que a presenca seja derivada automaticamente das respostas de prontuario, para controlar a participacao sem registro manual paralelo.

Critérios de aceite:
- Dado uma resposta de prontuario salva, quando consultar historico de frequencia, entao a presenca deve aparecer.
- Dado consulta de status do dia, quando chamar endpoint today, entao a API deve retornar itens de questionnaire_responses.
- Dado usuario sem autenticacao, quando consultar frequencia, entao a rota deve ser negada.

Tarefas tecnicas:
- Derivar presenca de questionnaire_responses com curso de questionnaires.
- Remover qualquer referencia a registro manual de frequencia.
- Validar payload de saida com timestamp e curso.

Estimativa: 5 pontos

#### US-10 - Consultar historico e relatorio de frequencia
Como coordenador, quero consultar historico e relatorio de frequencia por periodo, para acompanhar a participacao ao longo do tempo.

Critérios de aceite:
- Dado um periodo selecionado, quando consultar, entao a API deve retornar os registros filtrados.
- Dado filtro por curso, quando consultar, entao a API deve restringir os resultados ao curso informado.
- Dado um periodo sem dados, quando consultar, entao a resposta deve ser vazia, mas valida.
- Dado usuario sem autenticacao, quando acessar, entao a rota deve ser negada.

Tarefas tecnicas:
- Expor e validar GET /api/attendance/history.
- Expor e validar GET /api/attendance/report com permissao can_view_reports.
- Expor e validar GET /api/attendance/today.
- Implementar filtros por patient_id, patient_name, periodo e course.

Estimativa: 3 pontos

### EPIC: Cursos

#### US-11 - Manter cursos ativos e inativos
Como administrador, quero criar, editar e desativar cursos, para organizar as trilhas usadas no sistema.

Critérios de aceite:
- Dado um curso novo, quando salvar, entao ele deve ficar disponivel.
- Dado um curso inativo, quando consultar, entao ele deve ser identificado como desativado.
- Dado usuario sem perfil adequado, quando tentar alterar, entao deve receber 403.

Tarefas tecnicas:
- Revisar CRUD de cursos.
- Garantir desativacao sem perda historica.
- Ajustar listagem de cursos.

Estimativa: 3 pontos

### EPIC: Dashboard tecnico

#### US-12 - Consolidar dados do painel
Como gestor, quero visualizar dados consolidados, para entender a situacao geral do sistema.

Critérios de aceite:
- Dado dados existentes, quando consultar o painel, entao a resposta deve trazer indicadores corretos.
- Dado ausencia de dados, quando consultar, entao a API deve responder sem erro.
- Dado usuario sem contexto adequado, quando acessar, entao a resposta deve ser controlada.

Tarefas tecnicas:
- Revisar agregacoes do dashboard.
- Conferir origem dos indicadores.
- Padronizar campos retornados.

Estimativa: 3 pontos

## Sprint 4 - Prontuarios, questionarios e qualidade

### EPIC: Prontuarios

#### US-13 - Consultar prontuario por paciente
Como profissional autorizado, quero consultar o prontuario do paciente, para acompanhar o historico clinico.

Critérios de aceite:
- Dado um paciente existente, quando consultar o prontuario, entao os dados devem ser retornados.
- Dado paciente inexistente, quando consultar, entao a API deve retornar 404.
- Dado usuario sem permissao, quando acessar, entao deve ocorrer bloqueio.

Tarefas tecnicas:
- Revisar rota de prontuario.
- Validar permissao de acesso.
- Conferir integridade do retorno.

Estimativa: 5 pontos

#### US-14 - Upload de arquivo do prontuario
Como profissional autorizado, quero anexar arquivos ao prontuario, para centralizar documentos do paciente.

Critérios de aceite:
- Dado arquivo permitido, quando enviar, entao o backend deve salvar corretamente.
- Dado arquivo invalido, quando enviar, entao a API deve rejeitar a requisicao.
- Dado upload concluido, quando consultar depois, entao o arquivo deve estar acessivel.

Tarefas tecnicas:
- Validar tipo e tamanho de arquivo.
- Revisar armazenamento.
- Testar download e exclusao.

Estimativa: 5 pontos

### EPIC: Questionarios

#### US-15 - Criar estrutura de questionarios
Como profissional da equipe, quero cadastrar perguntas e questionarios, para padronizar a coleta de informacoes.

Critérios de aceite:
- Dado um questionario com perguntas, quando salvar, entao a estrutura deve ficar persistida.
- Dado um questionario inativo, quando consultar, entao ele nao deve ficar disponivel para resposta.
- Dado alteracao na estrutura, quando editar, entao a ordem e as opcoes devem ser preservadas.

Tarefas tecnicas:
- Revisar endpoints de perguntas e questionarios.
- Garantir relacao entre questionario e perguntas.
- Implementar publicacao e despublicacao.

Estimativa: 5 pontos

#### US-16 - Registrar respostas de questionarios
Como profissional autorizado, quero salvar respostas de questionarios por paciente, para apoiar a analise do caso.

Critérios de aceite:
- Dado paciente e questionario validos, quando enviar respostas, entao o registro deve ser salvo.
- Dado dados inconsistentes, quando enviar, entao a API deve retornar erro de validacao.
- Dado consulta posterior, quando buscar respostas, entao os dados devem estar vinculados corretamente.

Tarefas tecnicas:
- Revisar persistencia de respostas.
- Validar integridade referencial.
- Conferir consulta por paciente e questionario.

Estimativa: 5 pontos

### EPIC: Qualidade e seguranca

#### US-17 - Testes de integracao das rotas criticas
Como equipe de desenvolvimento, quero testar as rotas principais, para reduzir regressao.

Critérios de aceite:
- Dado a suite de testes, quando executar, entao as rotas criticas devem ser validadas.
- Dado uma alteracao futura, quando quebrar o comportamento esperado, entao o teste deve acusar a falha.

Tarefas tecnicas:
- Criar testes para login, pacientes, frequencia e prontuarios.
- Configurar ambiente de teste.
- Registrar como executar a suite.

Estimativa: 5 pontos

#### US-18 - Reforcar validacoes e seguranca da API
Como equipe tecnica, quero revisar validacoes e seguranca, para reduzir riscos de uso indevido.

Critérios de aceite:
- Dado entrada malformada, quando enviada, entao deve ser bloqueada.
- Dado origem nao permitida, quando requisitar, entao a politica de CORS deve agir corretamente.
- Dado endpoint sensivel, quando acessar sem permissao, entao o bloqueio deve ocorrer.

Tarefas tecnicas:
- Revisar CORS e headers.
- Ajustar validacao de entrada.
- Conferir rotas sensiveis.

Estimativa: 3 pontos

## Observacao para apresentacao academica

Se quiser dar a impressao de evolucao continua sem negar o que ja existe, apresente o trabalho como:

- consolidacao do backend;
- refinamento das regras de acesso;
- padronizacao da API;
- testes e seguranca;
- documentacao tecnica e estabilizacao.

Isso ajuda a justificar sprint, backlog e cards mesmo quando a base funcional ja esta pronta.