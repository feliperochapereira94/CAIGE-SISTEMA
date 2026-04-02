# Banco de Dados

## Objetivo

Descrever a estrutura de dados do sistema CAIGE, suas entidades principais e a forma como os dados sustentam as funcionalidades da aplicacao.

## SGBD utilizado

- MySQL 8+
- charset `utf8mb4`
- engine InnoDB

## Banco principal

- nome do banco: `caige`

## Entidades centrais

- `users`
- `permissions`
- `patients`
- `attendance`
- `medical_records`
- `questions`
- `questionnaires`
- `questionnaire_questions`
- `questionnaire_responses`
- `courses`
- `activities`
- `quick_stats`
- `professionals`

## Regras de negocio refletidas no banco

- controle de usuarios por papel, incluindo supervisor e professor;
- associacao entre pacientes e atendimentos;
- armazenamento de prontuarios por paciente e especialidade;
- vinculacao entre perguntas, questionarios e respostas;
- registro historico de atividades do sistema.

## Arquivos relacionados

- documento detalhado existente: [../BANCO_DE_DADOS.md](../BANCO_DE_DADOS.md)
- scripts SQL: [../Backend/database](../Backend/database)

## Scripts importantes

- `setup_completo.sql`
- `setup_zero.sql`
- scripts complementares de migracao e insercao de dados

## O que deve constar na versao final deste documento

### Estrutura logica

- descricao das tabelas;
- tipos de dados principais;
- chaves primarias;
- chaves estrangeiras;
- indices e restricoes.

### Relacionamentos

- usuario cria usuarios, perguntas e questionarios;
- paciente possui frequencias, prontuarios e respostas;
- questionario e composto por perguntas;
- atividades registram acoes realizadas no sistema.

### Evidencias visuais recomendadas

- DER exportado em imagem ou PDF;
- tabela-resumo com as principais entidades;
- observacoes sobre normalizacao e decisoes de modelagem.

## Recomendacao pratica

Como ja existe um documento detalhado do banco, a melhor estrategia para a entrega e manter este arquivo como guia resumido e apontar [../BANCO_DE_DADOS.md](../BANCO_DE_DADOS.md) como referencia tecnica completa. Para instalacao nova, trate [../Backend/database/setup_completo.sql](../Backend/database/setup_completo.sql) como script canonico.