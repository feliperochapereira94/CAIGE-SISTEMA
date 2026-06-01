# Insomnia Sprint 4

Este documento cobre somente os testes da Sprint 4:

- US-07: Cadastro de perguntas dos prontuários
- US-08: Montar prontuário com perguntas
- US-09: Salvar respostas do prontuário do paciente

## 1. Objetivo

- montar no Insomnia o CRUD de perguntas e questionários
- validar publicação de questionário
- validar gravação e consulta de respostas

## 2. Divisão entre 3 desenvolvedores

- Desenvolvedor A: cenário de sucesso
- Desenvolvedor B: cenário de validação
- Desenvolvedor C: cenário de autenticação/permissão

## 3. Como criar a coleção no Insomnia

1. Crie uma coleção chamada CAIGE Backend - Sprint 4.
2. Crie as pastas US-07, US-08 e US-09.
3. Defina variáveis no ambiente:
- base_url
- token_supervisor
- token_professor
- id_curso_teste
- id_pergunta_teste
- id_questionario_teste
- id_paciente_teste

## 4. US-07 - CRUD de perguntas

### Requisições para criar no Insomnia

- GET {{ base_url }}/api/questionarios/perguntas/curso/{{ id_curso_teste }}
- POST {{ base_url }}/api/questionarios/perguntas
- PUT {{ base_url }}/api/questionarios/perguntas/{{ id_pergunta_teste }}
- DELETE {{ base_url }}/api/questionarios/perguntas/{{ id_pergunta_teste }}

Body de criação (POST) exemplo:

```json
{
  "curso": 1,
  "texto": "Pergunta de teste",
  "tipo": "texto"
}
```

### Cenários por desenvolvedor

- Desenvolvedor A: CRUD completo de pergunta
- Desenvolvedor B: tipo inválido e validação 400
- Desenvolvedor C: tentativa sem permissão e validação 403

## 5. US-08 - CRUD de questionários e publicação

### Requisições para criar no Insomnia

- GET {{ base_url }}/api/questionarios/questionarios/curso/{{ id_curso_teste }}
- POST {{ base_url }}/api/questionarios/questionarios
- PUT {{ base_url }}/api/questionarios/questionarios/{{ id_questionario_teste }}
- PATCH {{ base_url }}/api/questionarios/questionarios/{{ id_questionario_teste }}/publicar
- DELETE {{ base_url }}/api/questionarios/questionarios/{{ id_questionario_teste }}
- GET {{ base_url }}/api/questionarios/questionarios/{{ id_questionario_teste }}/perguntas

Body de criação (POST) exemplo:

```json
{
  "curso": 1,
  "titulo": "Questionario Teste",
  "perguntas": [1, 2]
}
```

### Cenários por desenvolvedor

- Desenvolvedor A: criar, atualizar, publicar e listar perguntas do questionário
- Desenvolvedor B: publicar sem perguntas ativas e validar 400
- Desenvolvedor C: tentar criar/editar sem permissão e validar 403

## 6. US-09 - Respostas de prontuário

### Requisições para criar no Insomnia

- POST {{ base_url }}/api/questionarios/respostas
- GET {{ base_url }}/api/questionarios/respostas/{{ id_paciente_teste }}/{{ id_questionario_teste }}

Body de criação (POST) exemplo:

```json
{
  "idPaciente": 1,
  "idQuestionario": 1,
  "respostas": [
    {
      "idPergunta": 1,
      "valor": "Resposta de teste"
    }
  ]
}
```

### Cenários por desenvolvedor

- Desenvolvedor A: salvar respostas e consultar histórico
- Desenvolvedor B: enviar corpo incompleto e validar 400
- Desenvolvedor C: tentar sem token válido e validar 401/403

## 7. Evidências obrigatórias da Sprint 4

- captura da requisição e resposta
- data e hora
- responsável pelo cenário
- resultado final: Aprovado ou Reprovado

## 8. Critério para fechar a Sprint 4

- US-07, US-08 e US-09 aprovadas
- cenários A, B e C executados
- evidências registradas
