# Estrutura CAIGE - Backend

## 📁 Organização do Projeto

```
Backend/
├── src/
│   └── server.js              # Servidor Express (API principal)
├── database/
│   ├── schema.sql            # Schema do banco de dados
│   ├── setup.sql             # Script de setup
│   ├── create_tables.sql     # Criação de tabelas
│   ├── add_relationship.sql  # Coluna de parentesco
│   ├── update_patients.sql   # Updates diversos
│   └── migrations/           # Pasta para futuras migrações
├── migrate-add-relationship.js  # Migração: adicionar coluna relationship
├── migrate-add-photo.js        # Migração: adicionar coluna photo
├── setup-db.js                # Setup do banco de dados
├── package.json              # Dependências Node.js
├── .env                      # Variáveis de ambiente
└── README.md                 # Documentação
```

## 🔧 Configuração

### Arquivo `.env`
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=caige
```

### Dependências
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^2.3.3",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.3"
  }
}
```

## 🗄️ Banco de Dados

### Tabelas Principais

#### `users`
- id (INT, PRIMARY KEY)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- created_at (TIMESTAMP)

#### `patients`
- id (INT, PRIMARY KEY)
- name (VARCHAR)
- birth_date (DATE)
- gender (VARCHAR)
- cpf (VARCHAR)
- phone (VARCHAR)
- phone2 (VARCHAR)
- cep (VARCHAR)
- street (VARCHAR)
- number (VARCHAR)
- neighborhood (VARCHAR)
- city (VARCHAR)
- state (VARCHAR)
- responsible (VARCHAR)
- responsible_relationship (VARCHAR) - **NEW**
- responsible_phone (VARCHAR)
- photo (LONGTEXT) - **NEW**
- observations (LONGTEXT)
- status (VARCHAR)
- created_at (TIMESTAMP)

#### Tabelas Futuras
- `professionals` - Gerenciamento de profissionais
- `activities` - Atividades
- `quick_stats` - Estatísticas rápidas

## 🔌 Endpoints da API

### Autenticação
- `POST /login` - Fazer login
- `POST /change-password` - Alterar senha

### Pacientes (CRUD)
- `GET /api/patients` - Listar todos
- `GET /api/patients/:id` - Obter um paciente
- `POST /api/patients` - Criar novo
- `PUT /api/patients/:id` - Atualizar
- `DELETE /api/patients/:id` - Deletar

### Dashboard
- `GET /dashboard-data` - Dados para dashboard

## 📊 Migrações Realizadas

### 1. Adicionar Coluna `responsible_relationship`
```javascript
// migrate-add-relationship.js
ALTER TABLE patients ADD COLUMN responsible_relationship VARCHAR(50)
```

**Valores Permitidos:**
- mae, pai, filho, filha
- esposo, esposa
- irmao, irma
- avô, avo
- neto, neta
- tio, tia
- sobrinho, sobrinha
- primo, prima
- outro

### 2. Adicionar Coluna `photo`
```javascript
// migrate-add-photo.js
ALTER TABLE patients ADD COLUMN photo LONGTEXT
```

**Formato:** Base64 de imagem (armazenado como string)

## 🚀 Como Iniciar

```bash
# Instalar dependências
npm install

# Setup do banco de dados
node setup-db.js

# Executar migrações
node migrate-add-relationship.js
node migrate-add-photo.js

# Iniciar servidor
node src/server.js
```

## 📝 Exemplo de Requisição

### Criar Paciente
```javascript
POST /api/patients
Content-Type: application/json

{
  "name": "Maria Silva",
  "birth_date": "1955-03-15",
  "gender": "feminino",
  "cpf": "123.456.789-00",
  "phone": "(33) 99123-4567",
  "phone2": "(33) 98765-4321",
  "cep": "35010-050",
  "street": "Rua das Flores",
  "number": "123",
  "neighborhood": "Jardim Alice",
  "city": "Governador Valadares",
  "state": "MG",
  "responsible": "Ana Maria Santos",
  "responsible_relationship": "filha",
  "responsible_phone": "(33) 99999-8888",
  "photo": "data:image/png;base64,iVBORw0KGgo...",
  "observations": "Obs importantes...",
  "status": "ativo"
}
```

### Resposta
```json
{
  "message": "Paciente cadastrado com sucesso!"
}
```

## 🔐 Autenticação

- Email domain obrigatório: `@univale.br`
- Senhas hash com bcryptjs
- Sessão via localStorage no frontend

## 🐛 Troubleshooting

### Erro: "Access denied for user 'root'"
Verificar credenciais em `.env` e usuário MySQL

### Erro: "Table doesn't exist"
Executar `setup-db.js` para criar tabelas

### Coluna já existe
Migrações checam automaticamente antes de adicionar

## 📦 Próximos Passos

1. **Validações Avançadas** - Implementar schema validation
2. **Autenticação JWT** - Melhorar segurança
3. **Rate Limiting** - Proteger endpoints
4. **Logging** - Sistema de logs
5. **Backup Automático** - Backups periódicos

---

**Estrutura criada em:** 04/02/2026
**Versão:** 1.0
