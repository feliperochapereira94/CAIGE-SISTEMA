# Insomnia Sprint 1

Este documento cobre somente os testes da Sprint 1:

- US-01: Login com JWT
- US-02: Cadastro de usuários e permissões
- US-04: Cadastro e atualização de pacientes

## 1. Objetivo

- validar o funcionamento das rotas de autenticação, usuários e pacientes
- montar no Insomnia as requisições de CRUD da sprint
- dividir os cenários entre 3 desenvolvedores

## 2. Divisão entre 3 desenvolvedores

- Desenvolvedor A: cenário de sucesso (fluxo principal)
- Desenvolvedor B: cenário de validação (400)
- Desenvolvedor C: cenário de autenticação/permissão (401/403)

Regra: cada história da Sprint 1 deve ter evidência dos 3 cenários.

## 3. Como criar a coleção no Insomnia

1. Crie uma coleção chamada CAIGE Backend - Sprint 1.
2. Crie o ambiente com as variáveis:
- base_url = http://localhost:3000
- token_supervisor = vazio no início
- token_professor = vazio no início
- token_sem_permissao = vazio no início
- id_usuario_teste = vazio no início
- id_paciente_teste = vazio no início
3. Use estes cabeçalhos nas rotas protegidas:
- Authorization: Bearer {{ token_supervisor }}
- Content-Type: application/json

## 4. US-01 - Login com JWT

### Requisições para criar no Insomnia

- POST {{ base_url }}/api/autenticacao/entrar

Body de exemplo:

```json
{
	"email": "supervisor@univale.br",
	"senha": "123456"
}
```

### O que salvar no ambiente

- Salve o token retornado em token_supervisor.

### Cenários por desenvolvedor

- Desenvolvedor A: login válido e status 200
- Desenvolvedor B: login com senha inválida e status 401
- Desenvolvedor C: login com corpo incompleto e validação de erro

## 5. US-02 - CRUD de usuários

### Requisições para criar no Insomnia

- GET {{ base_url }}/api/usuarios
- POST {{ base_url }}/api/usuarios
- PUT {{ base_url }}/api/usuarios/{{ id_usuario_teste }}
- DELETE {{ base_url }}/api/usuarios/{{ id_usuario_teste }}

Body de criação (POST) exemplo:

```json
{
	"nome": "Usuario Teste",
	"email": "usuario.teste@univale.br",
	"senha": "123456",
	"tipo": "professor"
}
```

Body de atualização (PUT) exemplo:

```json
{
	"nome": "Usuario Teste Atualizado",
	"tipo": "professor"
}
```

### Cenários por desenvolvedor

- Desenvolvedor A: criar, listar, atualizar e excluir com token de supervisor
- Desenvolvedor B: criar com campo obrigatório ausente e validar 400
- Desenvolvedor C: tentar CRUD com token sem permissão e validar 403

## 6. US-04 - CRUD de pacientes

### Requisições para criar no Insomnia

- GET {{ base_url }}/api/pacientes
- GET {{ base_url }}/api/pacientes/{{ id_paciente_teste }}
- POST {{ base_url }}/api/pacientes
- PUT {{ base_url }}/api/pacientes/{{ id_paciente_teste }}
- DELETE {{ base_url }}/api/pacientes/{{ id_paciente_teste }}

Body de criação (POST) exemplo:

```json
{
	"nome": "Paciente Teste",
	"data_nascimento": "2010-05-20",
	"sexo": "M",
	"curso": 1
}
```

Body de atualização (PUT) exemplo:

```json
{
	"nome": "Paciente Teste Atualizado"
}
```

### Cenários por desenvolvedor

- Desenvolvedor A: fluxo CRUD completo com dados válidos
- Desenvolvedor B: criação com dados inválidos e validação 400
- Desenvolvedor C: tentativa sem token ou sem permissão e validação 401/403

## 7. Evidências obrigatórias da Sprint 1

- captura da requisição e da resposta (status e corpo)
- data e hora da execução
- nome do desenvolvedor responsável
- resultado final: Aprovado ou Reprovado

## 8. Critério para fechar a Sprint 1

- US-01, US-02 e US-04 aprovadas
- cenários A, B e C executados
- evidências anexadas no controle da equipe