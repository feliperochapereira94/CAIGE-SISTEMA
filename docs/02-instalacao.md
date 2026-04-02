# Instalacao

## Objetivo

Este documento descreve como preparar o ambiente e executar o sistema CAIGE localmente.

## Pre-requisitos

- Node.js 18 ou superior
- MySQL 8 ou superior em execucao
- npm disponivel no terminal
- permissao para criar banco de dados e tabelas no MySQL

## Estrutura esperada

O projeto possui duas aplicacoes principais:

- Backend: API e acesso ao banco de dados
- Frontend: paginas HTML, CSS e JavaScript consumindo a API

## Instalacao das dependencias

### Backend

1. Acesse a pasta Backend.
2. Execute `npm install`.

### Frontend

1. Acesse a pasta Frontend.
2. Execute `npm install`.

## Configuracao do banco de dados

1. Crie um banco chamado `caige` no MySQL, se ele ainda nao existir.
2. Execute os scripts SQL conforme a estrategia adotada pelo grupo.
3. Como referencia, consulte [../BANCO_DE_DADOS.md](../BANCO_DE_DADOS.md) e os arquivos em [../Backend/database](../Backend/database).

## Configuracao de ambiente do backend

Criar um arquivo `.env` na pasta Backend com valores equivalentes a:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=caige
```

## Execucao do sistema

### Opcao 1: iniciar por partes

Backend:

```powershell
cd Backend
npm install
npm run dev
```

Frontend:

```powershell
cd Frontend
npm install
npm run dev
```

### Opcao 2: usar scripts da raiz

O projeto possui os arquivos [../start-all.ps1](../start-all.ps1) e [../start-all.bat](../start-all.bat), que podem ser adaptados para iniciar backend e frontend em conjunto.

## Enderecos padrao

- Backend: http://localhost:3000
- Frontend: http://localhost:5500

## Credenciais iniciais de teste

- Email: suportecaige@univale.br
- Senha: 123456

## Problemas comuns

### Porta ocupada

Altere a porta do backend no `.env` ou finalize o processo que esta usando a porta 3000.

### Frontend nao abre

Verifique se o `live-server` foi instalado corretamente por meio das dependencias do frontend.

### Erro de conexao com o banco

Confirme host, usuario, senha e nome do banco na configuracao do backend.

### Falta de tabelas

Execute os scripts SQL de criacao e migracao disponiveis em [../Backend/database](../Backend/database).

## Recomendacao para a entrega final

Na versao final, vale complementar este documento com:

- versoes exatas do Node.js e MySQL utilizadas no desenvolvimento;
- print das telas de inicializacao;
- ordem oficial dos scripts SQL e migracoes;
- exemplo real do arquivo `.env.example`.