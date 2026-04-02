# CAIGE Frontend

Interface web do sistema CAIGE, desenvolvida com HTML, CSS e JavaScript vanilla. A aplicação é organizada por páginas e consome a API do backend para autenticação, cadastros, frequência, atividades e administração.

## Estrutura

O frontend está dividido nos seguintes grupos principais:

- `index.html`: ponto de entrada que redireciona para login ou dashboard conforme a sessão local
- `pages/`: telas da aplicação separadas por módulo
- `assets/css/`: estilos compartilhados e folhas específicas por contexto
- `assets/js/`: scripts auxiliares de permissões, notificações, menu do usuário e questionários
- `assets/images/`: imagens estáticas da interface
- `controllers/`: scripts de apoio a fluxos específicos, como autenticação

## Módulos da interface

As páginas atualmente presentes no sistema incluem:

- `pages/auth/login.html`: autenticação
- `pages/dashboard/dashboard.html`: painel principal
- `pages/patients/`: listagem, cadastro, edição, perfil, prontuários e questionários
- `pages/attendance/attendance.html`: registro de frequência
- `pages/attendance/frequency-report.html`: relatório de frequência
- `pages/activities/activities.html`: gerenciamento de atividades
- `pages/admin/users.html`: administração de usuários
- `pages/admin/courses.html`: administração de cursos
- `pages/admin/archived.html`: registros arquivados

## Recursos compartilhados

Alguns arquivos centrais da interface:

- `assets/js/user-menu.js`: menu do usuário e ações de sessão
- `assets/js/access-control.js`: controle de exibição por permissão
- `assets/js/questionnaire-handler.js`: suporte aos questionários e prontuários
- `assets/js/notifications.js`: notificações da interface
- `assets/css/login.css`: estilos da tela de login
- `assets/css/dashboard.css`: estilos do dashboard
- `assets/css/form.css`: estilos base de formulários
- `assets/css/patient.css`: estilos do módulo de pacientes

## Execução

Existem duas formas principais de usar a interface:

1. Integrada ao sistema completo, com o backend servindo a aplicação e a API em `http://localhost:3000`.
2. Em desenvolvimento local na pasta `Frontend`, usando o servidor estático definido no `package.json`.

### Comandos locais

Na pasta `Frontend`:

```bash
npm install
npm run dev
```

O script de desenvolvimento usa `live-server` na porta `5500`. Nesse modo, a interface é aberta separadamente, mas continua dependendo do backend em execução para chamadas da API.

## Observação

O frontend segue uma estrutura simples e direta, baseada em páginas HTML com scripts auxiliares compartilhados. Isso reduz acoplamento desnecessário e facilita manutenção dos módulos existentes.
