# Testes

## Objetivo

Registrar como o sistema foi validado e quais cenarios foram verificados durante o desenvolvimento.

## Tipos de teste recomendados

- testes manuais de interface;
- testes manuais de API;
- testes de fluxo completo entre frontend, backend e banco;
- validacao de regras criticas do sistema.

## Cenários minimos a documentar

### Autenticacao

- login com usuario valido;
- login com senha invalida;
- login com usuario inativo, se aplicavel.

### Pacientes

- cadastro de novo paciente;
- edicao de paciente;
- visualizacao de dados;
- validacao de campos obrigatorios.

### Frequencia

- registro de presenca;
- tentativa de duplicidade na mesma data.

### Prontuarios

- upload de arquivo;
- consulta de registro existente.

### Questionarios

- criacao de pergunta;
- criacao de questionario;
- vinculacao e resposta.

### Administracao

- cadastro de usuario;
- restricao de acesso por papel.

## Modelo de evidencias

Para cada teste, registrar:

- identificador do caso;
- objetivo;
- pre-condicoes;
- passos executados;
- resultado esperado;
- resultado obtido;
- status final.

## Recomendacao para entrega

Mesmo sem testes automatizados, a documentacao de testes manuais com evidencias ja fortalece bastante a apresentacao final do projeto.