# Arquitetura

## Visao arquitetural

O sistema CAIGE segue uma arquitetura web cliente-servidor, com separacao entre camada de interface, camada de regras de negocio e camada de persistencia.

## Camadas principais

### Frontend

Responsavel pela interface com o usuario, navegacao entre paginas, validacoes basicas e consumo da API.

### Backend

Responsavel por receber requisicoes HTTP, validar operacoes, aplicar regras do sistema, acessar o banco de dados e retornar respostas ao frontend.

### Banco de dados

Responsavel pela persistencia das entidades do dominio, como usuarios, pacientes, frequencia, prontuarios, questionarios e atividades.

## Organizacao atual do projeto

### Backend

- `src/server.js`: inicializacao do servidor e registro das rotas
- `src/controllers/`: logica das operacoes por modulo
- `src/routes/`: definicao dos endpoints
- `src/middleware/`: autenticacao, CORS e log de requisicoes
- `src/models/`: conexao e acesso ao banco
- `database/`: scripts SQL e apoio a migracoes

### Frontend

- `pages/`: telas da aplicacao
- `assets/`: CSS, imagens e scripts auxiliares

Observacao: a estrutura atual concentra a maior parte da logica diretamente nas paginas HTML e em scripts auxiliares de `assets/js`.

## Modulos principais do backend

Conforme a configuracao atual do servidor, os modulos expostos incluem:

- autenticacao
- usuarios
- pacientes
- dashboard
- atividades
- frequencia
- arquivamento
- prontuarios
- questionarios
- cursos

## Fluxo geral de operacao

1. O usuario acessa o frontend.
2. O frontend envia requisicoes HTTP ao backend.
3. O backend processa a requisicao e interage com o MySQL.
4. O backend devolve os dados tratados ao frontend.
5. A interface atualiza a tela com base na resposta.

## Fluxos relevantes para documentar na entrega

### Autenticacao

- entrada de credenciais;
- validacao do usuario;
- definicao do perfil de acesso;
- redirecionamento para a area autenticada.

### Cadastro de paciente

- preenchimento do formulario;
- envio dos dados ao backend;
- persistencia no banco;
- registro em atividades, quando aplicavel.

### Frequencia

- selecao do paciente;
- registro da presenca;
- impedimento de duplicidade por data.

### Prontuarios

- selecao do paciente;
- upload ou registro do prontuario;
- associacao ao usuario e especialidade.

### Questionarios

- criacao de perguntas;
- montagem de questionarios;
- vinculacao a cursos;
- registro das respostas do paciente.

## Pontos de atencao arquiteturais

- parte da documentacao antiga esta desatualizada em relacao a estrutura real;
- convem consolidar um diagrama simples de componentes para a entrega final;
- vale padronizar a descricao dos modulos entre README, apresentacao e relatorio.