# CAIGE Frontend

Interface web do sistema CAIGE, desenvolvida com HTML, CSS e JavaScript vanilla. A aplicacao e organizada por paginas e consome a API do backend para autenticacao, cadastro, frequencia, questionarios, atividades e administracao.

## Estrutura

O frontend esta dividido nos seguintes grupos principais:

- `index.html`: ponto de entrada que redireciona para login ou dashboard conforme a sessao local
- `paginas/`: telas da aplicacao separadas por modulo
- `recursos/css/`: estilos compartilhados e folhas especificas por contexto
- `recursos/js/`: scripts auxiliares de permissoes, notificacoes, menu do usuario, sidebar, formularios de pacientes e questionarios
- `recursos/images/`: imagens estaticas da interface

## MÃ³dulos da interface

As paginas atualmente presentes no sistema incluem:

- `paginas/autenticacao/entrar.html`: autenticacao
- `paginas/painel/painel.html`: painel principal
- `paginas/pacientes/`: listagem, cadastro, edicao, perfil e questionarios
- `paginas/frequencia/relatorio-frequencia.html`: relatorio de frequencia
- `paginas/atividades/atividades.html`: gerenciamento de atividades
- `paginas/administracao/usuarios.html`: administracao de usuarios, cursos e arquivados (abas)

## Recursos compartilhados

Alguns arquivos centrais da interface:

- `recursos/js/menu-usuario.js`: menu do usuario e acoes de sessao
- `recursos/js/controle-acesso.js`: controle de exibicao por permissao
- `recursos/js/gerenciador-questionarios.js`: suporte aos questionarios
- `recursos/js/notificacoes.js`: notificaÃ§Ãµes da interface
- `recursos/js/paciente-form-utils.js`: mascaras e autopreenchimento de campos de formulario de pacientes
- `recursos/js/sidebar-menu.js`: inicializacao compartilhada dos submenus laterais
- `recursos/css/autenticacao.css`: estilos da tela de login
- `recursos/css/painel.css`: estilos do dashboard
- `recursos/css/formulario.css`: estilos base de formulÃ¡rios
- `recursos/css/pacientes.css`: estilos do mÃ³dulo de pacientes

## ExecuÃ§Ã£o

Existem duas formas principais de usar a interface:

1. Integrada ao sistema completo, com o backend servindo a aplicacao e a API em `http://localhost:3000`.
2. Em desenvolvimento local na pasta `Frontend`, usando o servidor estÃ¡tico definido no `package.json`.

### Comandos locais

Na pasta `Frontend`:

```bash
npm install
npm run dev
```

O script de desenvolvimento usa `live-server` na porta `5500`. Nesse modo, a interface e aberta separadamente, mas continua dependendo do backend em execucao para chamadas da API.

## ObservaÃ§Ã£o

O frontend segue uma estrutura simples e direta, baseada em paginas HTML com scripts auxiliares compartilhados. Isso reduz acoplamento desnecessario e facilita manutencao dos modulos existentes.

## Contrato de API

A referencia oficial de API e contratos esta em `docs/05-api.md`.

