# Plano de Sprints do Backend para o Taiga

Este plano foi organizado para mostrar a evolucao do backend em 4 sprints, com foco em entregas incrementais. A narrativa prioriza a construcao da base do sistema, depois o login e o cadastro de cliente, e por fim os CRUDs e integracoes complementares.

## Diretriz geral

- o acompanhamento sera feito por parte, mesmo que partes do projeto ja estejam prontas
- o foco aqui e o backend
- cada sprint deve entregar algo demonstravel
- a sequencia abaixo ajuda a mostrar progresso para o professor sem parecer uma entrega unica e finalizada

## Sprint 1 - Estrutura inicial e login

### Objetivo

Criar a base tecnica do backend e disponibilizar o acesso inicial ao sistema.

### Entregas previstas

- configuracao da aplicacao Express
- conexao com o banco de dados
- organizacao de rotas, controllers e models
- endpoint de login
- middleware de autenticacao com JWT

### Arquivos principais

- [Backend/src/server.js](../../Backend/src/server.js)
- [Backend/src/routes/autenticacao.js](../../Backend/src/routes/autenticacao.js)
- [Backend/src/controllers/acessoController.js](../../Backend/src/controllers/acessoController.js)
- [Backend/src/controllers/autenticacaoController.js](../../Backend/src/controllers/autenticacaoController.js)
- [Backend/src/models/database.js](../../Backend/src/models/database.js)

### Resultado esperado

O sistema deve permitir autenticar o usuario e iniciar o fluxo de acesso ao backend.

## Sprint 2 - Cadastro de cliente

### Objetivo

Entregar o fluxo principal de cadastro de cliente/paciente, que e a segunda parte definida como prioridade no projeto.

### Entregas previstas

- cadastro de cliente
- consulta de lista de clientes
- edicao de dados cadastrais
- remocao com validacao de permissao
- validacoes basicas de entrada

### Arquivos principais

- [Backend/src/routes/pacientes.js](../../Backend/src/routes/pacientes.js)
- [Backend/src/controllers/pacientesController.js](../../Backend/src/controllers/pacientesController.js)
- [Backend/src/models/validacaoModel.js](../../Backend/src/models/validacaoModel.js)
- [Backend/src/models/esquemaModel.js](../../Backend/src/models/esquemaModel.js)

### Resultado esperado

O professor consegue ver que o sistema evoluiu do acesso inicial para uma funcao pratica do negocio, com foco em cadastro de cliente.

## Sprint 3 - CRUDs principais e permissões

### Objetivo

Avancar nos CRUDs centrais do sistema e consolidar o controle de acesso por perfil.

### Entregas previstas

- CRUD de usuarios
- CRUD de cursos
- ajustes nas permissoes de acesso
- suporte a consultas administrativas
- padronizacao das respostas da API

### Arquivos principais

- [Backend/src/routes/usuarios.js](../../Backend/src/routes/usuarios.js)
- [Backend/src/controllers/usuariosController.js](../../Backend/src/controllers/usuariosController.js)
- [Backend/src/routes/cursos.js](../../Backend/src/routes/cursos.js)
- [Backend/src/controllers/cursosController.js](../../Backend/src/controllers/cursosController.js)
- [Backend/src/controllers/acessoController.js](../../Backend/src/controllers/acessoController.js)

### Resultado esperado

Os cadastros administrativos passam a funcionar de forma consistente e mostram ampliacao da base do backend.

## Sprint 4 - Integracao, auditoria e fechamento tecnico

### Objetivo

Conectar os modulos restantes, registrar rastreabilidade e preparar o backend para consolidacao final.

### Entregas previstas

- auditoria de acoes do sistema
- painel com dados consolidados
- apoio a frequencia e questionarios
- arquivos de suporte e arquivamento
- revisao final de consistencia entre rotas e banco

### Arquivos principais

- [Backend/src/routes/atividades.js](../../Backend/src/routes/atividades.js)
- [Backend/src/controllers/atividadesController.js](../../Backend/src/controllers/atividadesController.js)
- [Backend/src/models/registroAtividadeModel.js](../../Backend/src/models/registroAtividadeModel.js)
- [Backend/src/routes/dados-painel.js](../../Backend/src/routes/dados-painel.js)
- [Backend/src/controllers/dadosPainelController.js](../../Backend/src/controllers/dadosPainelController.js)
- [Backend/src/routes/frequencia.js](../../Backend/src/routes/frequencia.js)
- [Backend/src/controllers/frequenciaController.js](../../Backend/src/controllers/frequenciaController.js)
- [Backend/src/routes/questionarios.js](../../Backend/src/routes/questionarios.js)
- [Backend/src/controllers/questionariosController.js](../../Backend/src/controllers/questionariosController.js)
- [Backend/src/routes/arquivo.js](../../Backend/src/routes/arquivo.js)
- [Backend/src/controllers/arquivoController.js](../../Backend/src/controllers/arquivoController.js)

### Resultado esperado

O backend fica pronto para demonstrar evolucao completa em ciclos curtos, com rastreio das acoes e integracao dos modulos principais.

## Como registrar isso no Taiga

Para cada sprint, crie uma historia de usuario principal e, abaixo dela, subdivida em tarefas menores.

Sugestao de historias:

- Sprint 1: login e estrutura do backend
- Sprint 2: cadastro de cliente
- Sprint 3: CRUDs administrativos e permissoes
- Sprint 4: auditoria e integracoes do sistema

## Observacao importante

Se for necessario reforcar a narrativa de progresso ao professor, mantenha o foco em entrega parcial e sequencial. O argumento principal e que o projeto foi construido em etapas, com o login e o cadastro de cliente como marcos centrais da evolucao inicial.