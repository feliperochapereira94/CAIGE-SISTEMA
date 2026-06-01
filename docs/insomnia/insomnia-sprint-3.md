# Insomnia Sprint 3

Este documento cobre somente os testes da Sprint 3:

- US-10: Auditoria e painel
- US-11: Padronizar erros e testes de rotas críticas
- US-12: Revisão final de documentação e banco

## 1. Objetivo

- validar consultas de auditoria e painel
- validar padrão de erro nas rotas críticas
- fechar consistência entre Insomnia, rotas e documentação

## 2. Divisão entre 3 desenvolvedores

- Desenvolvedor A: cenário de sucesso das consultas
- Desenvolvedor B: cenário de validação e estrutura de erro
- Desenvolvedor C: cenário de autenticação/permissão

## 3. Como criar a coleção no Insomnia

1. Crie uma coleção chamada CAIGE Backend - Sprint 3.
2. Crie as pastas US-10, US-11 e US-12.
3. Reutilize variáveis:
- base_url
- token_supervisor
- token_professor
- token_sem_permissao

## 4. US-10 - Auditoria e painel

### Requisições para criar no Insomnia

- GET {{ base_url }}/api/atividades
- GET {{ base_url }}/api/dados-painel

### Cenários por desenvolvedor

- Desenvolvedor A: consultas com token válido e status 200
- Desenvolvedor B: parâmetros inválidos (quando aplicável) e validação da resposta
- Desenvolvedor C: sem token e validação 401

## 5. US-11 - Padronização de erros (rotas críticas)

### Requisições para criar no Insomnia

- POST {{ base_url }}/api/autenticacao/entrar com credenciais inválidas
- POST {{ base_url }}/api/usuarios com corpo inválido
- POST {{ base_url }}/api/pacientes com corpo inválido
- POST {{ base_url }}/api/questionarios/perguntas sem permissão

### Cenários por desenvolvedor

- Desenvolvedor A: validar mensagens de erro esperadas em fluxo controlado
- Desenvolvedor B: validar status 400 e formato de erro para dados inválidos
- Desenvolvedor C: validar status 401/403 para autenticação/permissão

## 6. US-12 - Revisão final de documentação e banco

### Checklist no Insomnia

- confirmar se os endpoints usados nos testes existem nas rotas
- confirmar se variáveis de ambiente usadas nas requisições estão corretas
- repetir chamadas críticas para garantir que não houve regressão

### Cenários por desenvolvedor

- Desenvolvedor A: conferência das rotas de sucesso
- Desenvolvedor B: conferência das rotas de validação
- Desenvolvedor C: conferência das rotas de autenticação/permissão

## 7. Observação sobre CRUD na Sprint 3

Nesta sprint, o foco principal é leitura e qualidade técnica.
Não há CRUD novo completo para cadastro de entidade, então os testes ficam concentrados em GET e em padronização de erros.

## 8. Evidências obrigatórias da Sprint 3

- captura da requisição e resposta
- data e hora
- responsável pelo cenário
- resultado final: Aprovado ou Reprovado
