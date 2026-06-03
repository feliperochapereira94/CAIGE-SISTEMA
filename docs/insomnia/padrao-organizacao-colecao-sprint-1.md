# Padrao de organizacao da colecao Insomnia - Sprint 1

Este documento define um padrao unico para o time testar a Sprint 1 no Insomnia sem sobrescrever variaveis entre desenvolvedores.

## 1. Estrutura da colecao

Nome sugerido da colecao:

- CAIGE Backend - Sprint 1

Pastas obrigatorias:

- 00 - Setup
- US-01 - Autenticacao
- US-02 - Usuarios
- US-04 - Pacientes
- 99 - Evidencias

Padrao de nomes de requisicao:

- [US-01][A] Login valido
- [US-01][B] Login senha invalida
- [US-01][C] Login corpo incompleto

Use o mesmo padrao para US-02 e US-04 com os sufixos [A], [B] e [C].

## 2. Environments

Mantenha 1 environment por desenvolvedor para evitar conflito de IDs e tokens.

Variaveis base:

- base_url
- token_supervisor
- token_professor
- token_sem_permissao
- id_usuario_teste
- id_paciente_teste
- dev_nome
- cenario_foco

Valores iniciais recomendados:

- base_url = http://localhost:3000
- tokens e ids = string vazia

## 3. Divisao por desenvolvedor

- Dev A: foco em cenarios de sucesso (200, 201, 204)
- Dev B: foco em validacao (400)
- Dev C: foco em autenticacao/permissao (401, 403)

Todos devem importar a mesma estrutura de requests. O que muda por pessoa e apenas o environment.

## 4. Arquivos de import prontos neste repositorio

- docs/insomnia/insomnia-sprint-1-dev-a.json
- docs/insomnia/insomnia-sprint-1-dev-b.json
- docs/insomnia/insomnia-sprint-1-dev-c.json

Cada arquivo contem:

- workspace da Sprint 1
- pasta de requisicoes US-01, US-02 e US-04
- environment pronto para o dev correspondente

## 5. Como importar no Insomnia

1. Abrir Insomnia.
2. Clicar em Create > Import > From File.
3. Selecionar o arquivo do seu dev.
4. Ajustar credenciais do login no request de autenticacao.
5. Executar login e copiar token para token_supervisor.
6. Executar os requests da sua trilha de cenario.

## 6. Evidencias minimas por cenario

- request completo (metodo, rota e body)
- response (status e corpo)
- data/hora da execucao
- dev responsavel
- resultado (Aprovado ou Reprovado)

## 7. Observacoes

- Se houver conflito de dados (mesmo email ou mesmo paciente), altere os campos no body com um sufixo do dev.
- Nao compartilhar token entre environments.
- Em caso de reset de banco, repetir login e atualizar token no environment.