# Continuidade da Responsividade

Este documento e interno e serve apenas para retomar o ajuste de responsividade do projeto caso o trabalho seja interrompido.

## Como usar

1. Abra este repositorio no VS Code.
2. Consulte o checklist abaixo para lembrar a ordem de execucao.
3. Cole o prompt de retomada no chat.
4. Continue a implementacao sem reabrir todo o escopo do zero.

## Checklist de continuidade

### Direcao geral

- [ ] Nao criar uma interface separada so para mobile.
- [ ] Evoluir o codigo atual com refatoracao incremental.
- [ ] Ajustar primeiro a base global compartilhada.
- [ ] Depois corrigir as telas prioritarias.
- [ ] Reduzir estilos inline repetidos dentro dos HTMLs.
- [ ] Evitar retrabalho, duplicacao de CSS e solucoes paralelas.

### Arquivos base para revisar primeiro

- [ ] Frontend/assets/css/dashboard.css
- [ ] Frontend/assets/css/form.css
- [ ] Frontend/assets/css/patient.css
- [ ] Frontend/assets/css/profile.css
- [ ] Frontend/assets/css/questionnaire.css
- [ ] Frontend/assets/css/login.css
- [ ] Frontend/assets/css/notifications.css

### Ordem de prioridade das telas

- [ ] Frontend/pages/dashboard/dashboard.html
- [ ] Frontend/pages/patients/list.html
- [ ] Frontend/pages/patients/new.html
- [ ] Frontend/pages/patients/edit.html
- [ ] Frontend/pages/attendance/attendance.html
- [ ] Frontend/pages/attendance/frequency-report.html
- [ ] Frontend/pages/activities/activities.html
- [ ] Frontend/pages/admin/users.html
- [ ] Frontend/pages/admin/courses.html

### Problemas ja identificados

- [ ] Melhorar comportamento da sidebar e do layout global em mobile.
- [ ] Corrigir grids fixos e tabelas largas demais para celular.
- [ ] Padronizar modais, filtros, abas e tabelas.
- [ ] Revisar media queries existentes e consolidar o que estiver inconsistente.
- [ ] Eliminar overflow horizontal indevido.

### Criterios de validacao

- [ ] Desktop continua funcionando bem.
- [ ] Tablet continua legivel e navegavel.
- [ ] Mobile em 768px funciona sem quebra estrutural.
- [ ] Mobile em 480px funciona sem excesso de aperto.
- [ ] Mobile em 375px continua utilizavel no touch.
- [ ] Formularios, modais, filtros e navegacao continuam acessiveis.

## Prompt de retomada

```text
Estou continuando o trabalho de responsividade do sistema CAIGE.

Contexto do projeto:
- O sistema possui Backend e Frontend separados.
- O frontend esta em HTML, CSS e JavaScript vanilla.
- A pasta principal do frontend esta em Frontend/.
- Ja existe uma base parcial de responsividade, mas ela esta inconsistente entre as telas.
- A orientacao anterior foi NAO criar uma "parte separada so para responsivo". A estrategia correta e evoluir o codigo atual com refatoracao incremental.

Direcao esperada:
- Consolidar primeiro a base global compartilhada.
- Depois corrigir as telas prioritarias.
- Remover dependencia excessiva de estilos inline repetidos.
- Evitar retrabalho, duplicacao de CSS e solucoes paralelas.
- Manter o visual e a estrutura existentes sempre que possivel.

Arquivos base que precisam de atencao:
- Frontend/assets/css/dashboard.css
- Frontend/assets/css/form.css
- Frontend/assets/css/patient.css
- Frontend/assets/css/profile.css
- Frontend/assets/css/questionnaire.css
- Frontend/assets/css/login.css
- Frontend/assets/css/notifications.css

Telas prioritarias:
1. Frontend/pages/dashboard/dashboard.html
2. Frontend/pages/patients/list.html
3. Frontend/pages/patients/new.html
4. Frontend/pages/patients/edit.html
5. Frontend/pages/attendance/attendance.html
6. Frontend/pages/attendance/frequency-report.html
7. Frontend/pages/activities/activities.html
8. Frontend/pages/admin/users.html
9. Frontend/pages/admin/courses.html

Problemas ja identificados anteriormente:
- Sidebar e layout global ainda precisam de melhor comportamento em mobile.
- Ha telas com grids fixos e tabelas largas demais para celular.
- Existem varios estilos inline repetidos dentro dos HTMLs.
- Modais, filtros, abas e tabelas precisam de padronizacao.
- Algumas telas tem media queries, mas ainda nao estao maduras o suficiente para entrega profissional.

Quero que voce siga esta ordem de trabalho:
1. Verifique o estado atual dos arquivos compartilhados de layout e responsividade.
2. Confirme o que ja esta bom e o que ainda precisa de intervencao.
3. Proponha um plano curto e objetivo.
4. Implemente primeiro a base global.
5. Depois avance para as telas prioritarias em ordem.
6. Ao final de cada etapa, informe o que foi ajustado e o que ainda falta.

Critérios de qualidade:
- Nao criar outra interface paralela so para mobile.
- Nao quebrar o layout desktop atual sem necessidade.
- Nao introduzir mudancas visuais desnecessarias fora do escopo.
- Priorizar manutencao, consistencia e legibilidade.
- Garantir boa experiencia em 1440px, 1024px, 768px, 480px e 375px.
- Eliminar overflow horizontal indevido.
- Garantir formularios, modais, filtros, tabelas e navegacao usaveis no touch.

Se houver duvida sobre prioridade, siga esta ordem:
1. dashboard.css e base global
2. formularios e componentes compartilhados
3. dashboard
4. pacientes
5. frequencia
6. atividades
7. administracao

Quero que voce comece inspecionando os arquivos mais importantes, sem assumir que o estado atual e igual ao de dias anteriores, e depois prossiga com implementacao real no codigo.
```

## Observacoes finais

- Se o prazo estiver curto, priorize base global, dashboard, pacientes e frequencia.
- Se houver tempo, faca a limpeza dos estilos inline repetidos como etapa posterior.
- Antes de finalizar, valide se o sistema continua bom no desktop e utilizavel no mobile.