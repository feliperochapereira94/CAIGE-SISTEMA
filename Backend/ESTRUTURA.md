# Estrutura do Backend CAIGE (PT-BR)

## Visao geral

O backend usa Node.js + Express + MySQL, com organizacao por camadas:
- rotas em src/routes
- controladores em src/controllers
- modelos em src/models
- scripts SQL em database

Nao ha suporte a anexos/fotos/upload neste backend.

## Estrutura de pastas

```
Backend/
|-- src/
|   |-- server.js
|   |-- routes/
|   |   |-- autenticacao.js
|   |   |-- usuarios.js
|   |   |-- pacientes.js
|   |   |-- frequencia.js
|   |   |-- atividades.js
|   |   |-- dados-painel.js
|   |   |-- questionarios.js
|   |   |-- cursos.js
|   |   `-- arquivo.js
|   |-- controllers/
|   |-- models/
|   `-- ...
|-- database/
|   |-- setup_completo.sql
|   `-- setup_zero.sql
|-- init-db.js
|-- package.json
|-- package-lock.json
|-- .env.example
`-- .gitignore
```

## Arquivos de banco

- setup_completo.sql: cria o banco e popula com dados de teste.
- setup_zero.sql: cria o banco com estrutura e usuario suporte.

## Arquivo de ambiente

Exemplo em .env.example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=caige
DB_PORT=3306
PORT=3000
NODE_ENV=development
```

## Inicializacao

1. Ajustar variaveis de ambiente no arquivo .env.
2. Rodar o SQL no MySQL Workbench (setup_completo.sql ou setup_zero.sql).
3. Iniciar o servidor:

```bash
npm install
npm start
```

Opcional: para executar o setup_completo.sql via Node, usar init-db.js.
