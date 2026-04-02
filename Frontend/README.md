# CAIGE Frontend

Interface web do sistema CAIGE, composta por páginas HTML, CSS e JavaScript vanilla servidas pelo backend.

## Estrutura atual

O frontend está organizado principalmente em:

- `pages/`: telas da aplicação
- `assets/css/`: estilos compartilhados
- `assets/js/`: scripts auxiliares de menu, permissões e questionários
- `assets/images/`: imagens estáticas

## Fluxos principais

- autenticação em `pages/auth/login.html`
- dashboard em `pages/dashboard/dashboard.html`
- pacientes em `pages/patients/`
- frequência em `pages/attendance/`
- atividades em `pages/activities/`
- administração em `pages/admin/`

## Execução

O frontend é servido estaticamente pelo backend em `http://localhost:3000`.

Também é possível usar `npm run dev` na pasta `Frontend` para desenvolvimento local, quando necessário.

## Observação

A estrutura antiga com camadas separadas de `controllers/`, `models/`, `utils/` e `views/components/` não era mais utilizada em runtime e foi removida para reduzir redundância.
