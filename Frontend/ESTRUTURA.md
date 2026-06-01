# Estrutura CAIGE - Frontend

## Organizacao

O frontend esta organizado por paginas, recursos compartilhados e scripts auxiliares:

```text
Frontend/
  index.html
  recursos/
    css/
      autenticacao.css
      formulario.css
      menu-usuario.css
      notificacoes.css
      pacientes.css
      painel.css
      perfil.css
      questionarios.css
    images/
    js/
      controle-acesso.js
      gerenciador-questionarios.js
      menu-usuario.js
      notificacoes.js
      paciente-form-utils.js
      sidebar-menu.js
  paginas/
    administracao/
      usuarios.html
    atividades/
      atividades.html
    autenticacao/
      entrar.html
    frequencia/
      relatorio-frequencia.html
    pacientes/
      editar.html
      lista.html
      novo.html
      questionario-detalhes.html
      questionarios.html
      visualizar.html
    painel/
      painel.html
```

## Modulo de Pacientes

As paginas principais do modulo de pacientes ficam em `paginas/pacientes/`:

- `lista.html`: listagem, busca e filtros
- `novo.html`: novo cadastro
- `visualizar.html`: perfil completo e fluxo de questionarios
- `editar.html`: atualizacao cadastral
- `questionario-detalhes.html`: gerenciamento de prontuarios cadastrados
- `questionarios.html`: cadastro de perguntas

## Integracao API

Base da API: `http://localhost:3000`

Arquivos auxiliares principais:

- `recursos/js/menu-usuario.js`
- `recursos/js/controle-acesso.js`
- `recursos/js/gerenciador-questionarios.js`
- `recursos/js/notificacoes.js`
- `recursos/js/paciente-form-utils.js`
- `recursos/js/sidebar-menu.js`

## Navegacao Principal

1. `paginas/pacientes/lista.html`
2. `paginas/pacientes/visualizar.html?id=<id>`
3. `paginas/pacientes/editar.html?id=<id>`
