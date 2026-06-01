# CAIGE SISTEMA - Banco de Dados

## Visao geral

O banco `caige` segue nomenclatura PT-BR e e inicializado pelos scripts:

- `Backend/database/setup_completo.sql`
- `Backend/database/setup_zero.sql`

Nao existe modulo de upload de anexos no backend atual.

## Tabelas principais

- `usuarios`
- `permissoes`
- `profissionais`
- `cursos`
- `pacientes`
- `atividades`
- `frequencia`
- `perguntas`
- `questionarios`
- `questoes_questionarios`
- `respostas_questionarios`
- `estatisticas_rapidas`

## Regras relevantes

- `usuarios.papel`: `SUPERVISOR` ou `PROFESSOR`
- `permissoes` define acesso por papel
- `frequencia` possui unicidade por paciente e data (`uniq_frequencia_paciente_data`)
- `questionarios` podem ser publicados (`publicado`)
- `questoes_questionarios` controla ordem e ativacao de perguntas por questionario
- `respostas_questionarios.dados_resposta` guarda snapshot das respostas em JSON

## Relacionamentos essenciais

- `usuarios.criado_por` -> `usuarios.id`
- `frequencia.id_paciente` -> `pacientes.id`
- `frequencia.id_profissional` -> `profissionais.id`
- `perguntas.criado_por` -> `usuarios.id`
- `questionarios.criado_por` -> `usuarios.id`
- `questoes_questionarios.id_questionario` -> `questionarios.id`
- `questoes_questionarios.id_pergunta` -> `perguntas.id`
- `respostas_questionarios.id_paciente` -> `pacientes.id`
- `respostas_questionarios.id_questionario` -> `questionarios.id`

## Seeds padrao

Os scripts de setup criam, no minimo:

- usuario supervisor `suportecaige@univale.br`
- permissao para papel `SUPERVISOR`

No setup completo, ha tambem dados de exemplo para cursos, pacientes, atividades, frequencia, perguntas, questionarios e respostas.

## Referencias

- Estrutura do backend: `Backend/ESTRUTURA.md`
- Script canonico completo: `Backend/database/setup_completo.sql`
- Script zerado: `Backend/database/setup_zero.sql`
