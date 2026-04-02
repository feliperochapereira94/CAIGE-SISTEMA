# Estrutura CAIGE - Frontend

## Organização do Projeto

O frontend está organizado por páginas, recursos compartilhados e módulos auxiliares:

```
Frontend/
├── index.html
├── assets/
│   ├── css/
│   │   ├── dashboard.css
│   │   ├── form.css
│   │   ├── patient.css
│   │   ├── profile.css
│   │   └── ...
│   ├── images/
│   └── js/
├── pages/
│   ├── activities/
│   ├── admin/
│   ├── attendance/
│   ├── auth/
│   ├── dashboard/
│   └── patients/
└── ...
```

## Módulo de Pacientes

As páginas principais do cadastro de pacientes ficam em `pages/patients/`:

- `list.html`: listagem, busca, filtros e navegação para perfil
- `new.html`: novo cadastro com foto, endereço e responsável
- `view.html`: perfil completo, prontuários e resumo clínico
- `edit.html`: atualização de dados cadastrais
- `medical-records.html`: arquivos e prontuários médicos
- `questions.html`: formulários e questionários auxiliares

## CSS Principal

Os estilos mais usados no fluxo de pacientes estão em:

- `assets/css/patient.css`: listagem e componentes do módulo de pacientes
- `assets/css/profile.css`: visualização de perfil
- `assets/css/form.css`: campos e formulários

## Integração com API

O frontend consome a API principal em `http://localhost:3000`.

- `assets/js/user-menu.js`: carrega perfil, menu do usuário e ações da conta
- `assets/js/access-control.js`: controla exibição de módulos administrativos
- `assets/js/questionnaire-handler.js`: gerencia prontuários por curso

## Navegação Principal

Fluxo principal do módulo:

1. `pages/patients/list.html`
2. `pages/patients/view.html?id=<id>`
3. `pages/patients/edit.html?id=<id>`

## Observação

O frontend foi padronizado para páginas HTML com scripts inline e módulos auxiliares em `assets/js`, reduzindo camadas antigas que não estavam mais em uso.
