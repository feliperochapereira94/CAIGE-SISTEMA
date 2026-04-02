# Matriz de Permissoes

## Objetivo

Consolidar, em um unico documento, quais perfis podem acessar cada grupo de funcionalidades do sistema CAIGE.

## Fontes consideradas

Esta matriz foi montada com base em:

- [../Backend/src/middleware/auth.js](../Backend/src/middleware/auth.js)
- [../Backend/src/routes/users.js](../Backend/src/routes/users.js)
- [../Backend/src/routes/patients.js](../Backend/src/routes/patients.js)
- [../Backend/src/routes/attendance.js](../Backend/src/routes/attendance.js)
- [../Backend/src/routes/activities.js](../Backend/src/routes/activities.js)
- [../Backend/src/routes/archive.js](../Backend/src/routes/archive.js)
- [../Backend/src/routes/medical-records.js](../Backend/src/routes/medical-records.js)
- [../Backend/src/routes/questionnaires.js](../Backend/src/routes/questionnaires.js)
- [../Backend/src/routes/courses.js](../Backend/src/routes/courses.js)
- [../BANCO_DE_DADOS.md](../BANCO_DE_DADOS.md)

## Perfis do sistema

| Perfil | Descricao |
|--------|-----------|
| `SUPERVISOR` | Administrador com acesso total ao sistema, inclusive gestao de usuarios e cursos |
| `PROFESSOR` | Usuario operacional, com acesso aos fluxos academicos e assistenciais permitidos |

## Regras gerais de autenticacao

- qualquer rota protegida exige o header `x-user-email`;
- o backend identifica o usuario pelo email enviado;
- o middleware `requireAuth` carrega `req.user` com `id`, `email` e `role`;
- o middleware `requireSupervisor` restringe operacoes exclusivas do supervisor;
- o middleware `requirePermission(...)` consulta a tabela `permissions` por role.

## Matriz por permissao de negocio

| Permissao | Supervisor | Professor | Uso principal |
|-----------|:----------:|:---------:|---------------|
| `can_check_in` | ✔ | ✔ | registrar frequencia |
| `can_create_patient` | ✔ | ✔ | cadastrar paciente |
| `can_edit_patient` | ✔ | ✔ | editar ou arquivar paciente |
| `can_view_patient` | ✔ | ✔ | listar e visualizar pacientes |
| `can_view_reports` | ✔ | ✔ | consultar relatorios de frequencia |
| `can_create_user` | ✔ | ✗ | criar usuarios |
| `can_edit_user` | ✔ | ✗ | editar, inativar e consultar usuarios |
| `can_view_medical_records` | ✔ | ✔ | acessar prontuarios e respostas |
| `can_manage_activities` | ✔ | ✔ | criar perguntas e questionarios |
| `can_access_dashboard` | ✔ | ✔ | acessar dashboard |

## Matriz por modulo funcional

| Modulo ou acao | Supervisor | Professor | Base tecnica |
|----------------|:----------:|:---------:|--------------|
| Login no sistema | ✔ | ✔ | `POST /login` |
| Consultar perfil proprio | ✔ | ✔ | `/profile`, `/api/users/profile` |
| Alterar propria senha | ✔ | ✔ | `POST /change-password` |
| Ver dashboard | ✔ | ✔ | `GET /dashboard-data` |
| Ver atividades | ✔ | ✔ | `GET /api/activities` |
| Listar pacientes | ✔ | ✔ | `GET /api/patients` |
| Visualizar paciente | ✔ | ✔ | `GET /api/patients/:id` |
| Cadastrar paciente | ✔ | ✔ | `POST /api/patients` |
| Editar paciente | ✔ | ✔ | `PUT /api/patients/:id` |
| Arquivar paciente | ✔ | ✔ | `DELETE /api/patients/:id` |
| Registrar frequencia | ✔ | ✔ | `POST /api/attendance/register` |
| Ver historico de frequencia | ✔ | ✔ | `GET /api/attendance/history` |
| Emitir relatorio de frequencia | ✔ | ✔ | `GET /api/attendance/report` |
| Ver status do dia | ✔ | ✔ | `GET /api/attendance/today` |
| Consultar prontuarios | ✔ | ✔ | `GET /api/medical-records/:patient_id` |
| Anexar prontuario | ✔ | ✔ | `POST /api/medical-records/:patient_id/upload` |
| Baixar prontuario | ✔ | ✔ | `GET /api/medical-records/:record_id/download` |
| Remover prontuario | ✔ | ✔ | `DELETE /api/medical-records/:record_id` |
| Listar perguntas por curso | ✔ | ✔ | `GET /api/questionnaires/questions/course/:course` |
| Criar pergunta | ✔ | ✔ | `POST /api/questionnaires/questions` |
| Editar pergunta | ✔ | ✔ | `PUT /api/questionnaires/questions/:id` |
| Remover pergunta | ✔ | ✔ | `DELETE /api/questionnaires/questions/:id` |
| Listar questionarios por curso | ✔ | ✔ | `GET /api/questionnaires/questionnaires/course/:course` |
| Criar questionario | ✔ | ✔ | `POST /api/questionnaires/questionnaires` |
| Editar questionario | ✔ | ✔ | `PUT /api/questionnaires/questionnaires/:id` |
| Publicar questionario | ✔ | ✔ | `PATCH /api/questionnaires/questionnaires/:id/publish` |
| Remover questionario | ✔ | ✔ | `DELETE /api/questionnaires/questionnaires/:id` |
| Salvar respostas de questionario | ✔ | ✔ | `POST /api/questionnaires/responses` |
| Consultar respostas de questionario | ✔ | ✔ | `GET /api/questionnaires/responses/:patientId/:questionnaireId` |
| Listar cursos | ✔ | ✔ | `GET /api/courses` |
| Criar curso | ✔ | ✗ | `POST /api/courses` |
| Editar curso | ✔ | ✗ | `PUT /api/courses/:id` |
| Remover curso | ✔ | ✗ | `DELETE /api/courses/:id` |
| Listar usuarios | ✔ | ✗ | `GET /api/users` |
| Criar usuario | ✔ | ✗ | `POST /api/users` |
| Editar usuario | ✔ | ✗ | `PUT /api/users/:id` |
| Inativar usuario | ✔ | ✗ | `DELETE /api/users/:id` |
| Ver usuarios arquivados | ✔ | ✗ | `GET /api/archive/users` |
| Ver pacientes arquivados | ✔ | ✗ | `GET /api/archive/patients` |

## Observacoes importantes

### Supervisor

- possui acesso completo aos modulos administrativos;
- pode gerenciar usuarios, cursos e arquivos arquivados;
- tambem pode operar os fluxos comuns de atendimento.

### Professor

- possui acesso aos fluxos operacionais do atendimento;
- nao pode administrar usuarios;
- nao pode gerenciar cursos;
- nao pode consultar os endpoints de arquivamento administrativo.

## Restricoes adicionais observadas no codigo

Algumas operacoes tem regras complementares alem da role.

### Perguntas e questionarios

- professores e supervisores podem criar e editar, mas existem validacoes por curso no controller de questionarios;
- o professor so pode gerenciar perguntas e questionarios do proprio curso;
- algumas acoes exigem que o usuario seja autor do item ou tenha compatibilidade de curso.

### Publicacao e exclusao de questionarios

- a publicacao exige que o questionario tenha pelo menos uma pergunta ativa;
- a exclusao e bloqueada quando ja existem respostas registradas.

### Exclusao de cursos

- o curso nao pode ser removido se houver usuarios vinculados a ele.

### Frequencia

- o sistema impede duas presencas do mesmo paciente no mesmo dia.

## Uso recomendado na entrega final

Esta matriz pode ser usada de tres formas na apresentacao final:

- como tabela de referencia tecnica no relatorio;
- como evidencia de controle de acesso por perfil;
- como base para explicar diferencas entre operacao e administracao do sistema.