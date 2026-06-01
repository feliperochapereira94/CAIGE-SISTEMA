# Insomnia Sprint 2

Este documento cobre somente os testes da Sprint 2:

- US-03: Perfil do usuário autenticado
- US-05: Listagem de pacientes
- US-06: CRUD de cursos

## 1. Objetivo

- validar perfil autenticado e listagens da sprint
- montar no Insomnia o CRUD de cursos
- dividir os cenários entre 3 desenvolvedores

## 2. Divisão entre 3 desenvolvedores

- Desenvolvedor A: cenário de sucesso (200)
- Desenvolvedor B: cenário de validação (400)
- Desenvolvedor C: cenário de autenticação/permissão (401/403)

## 3. Como criar a coleção no Insomnia

1. Crie uma coleção chamada CAIGE Backend - Sprint 2.
2. Reutilize o ambiente da Sprint 1 e confirme:
- base_url
- token_supervisor
- token_professor
- token_sem_permissao
- id_curso_teste
3. Crie as pastas US-03, US-05 e US-06.

## 4. US-03 - Perfil do usuário autenticado

### Requisição para criar no Insomnia

- GET {{ base_url }}/api/autenticacao/perfil

### Cenários por desenvolvedor

- Desenvolvedor A: token válido e status 200
- Desenvolvedor B: token malformado e validação de erro
- Desenvolvedor C: sem token e status 401

## 5. US-05 - Listagem de pacientes

### Requisições para criar no Insomnia

- GET {{ base_url }}/api/pacientes
- GET {{ base_url }}/api/pacientes?nome=Paciente

### Cenários por desenvolvedor

- Desenvolvedor A: listagem com token válido
- Desenvolvedor B: filtro inválido ou dados inexistentes e validação do retorno
- Desenvolvedor C: sem permissão de visualização e validação 403

## 6. US-06 - CRUD de cursos

### Requisições para criar no Insomnia

- GET {{ base_url }}/api/cursos
- POST {{ base_url }}/api/cursos
- PUT {{ base_url }}/api/cursos/{{ id_curso_teste }}
- DELETE {{ base_url }}/api/cursos/{{ id_curso_teste }}

Body de criação (POST) exemplo:

```json
{
  "nome": "Curso Teste Sprint 2"
}
```

Body de atualização (PUT) exemplo:

```json
{
  "nome": "Curso Teste Sprint 2 Atualizado"
}
```

### Cenários por desenvolvedor

- Desenvolvedor A: CRUD completo com supervisor
- Desenvolvedor B: criação com nome ausente e validação 400
- Desenvolvedor C: tentativa de criação/edição com perfil sem permissão e validação 403

## 7. Evidências obrigatórias da Sprint 2

- captura da requisição e resposta
- data e hora
- responsável pelo cenário
- resultado final: Aprovado ou Reprovado

## 8. Critério para fechar a Sprint 2

- US-03, US-05 e US-06 aprovadas
- cenários A, B e C executados
- evidências registradas
