# Estrutura CAIGE - Backend

## 📁 Organização do Projeto

```
Backend/
├── src/
│   └── server.js              # Servidor Express (API principal)
├── database/
│   ├── setup_completo.sql      # Script principal com estrutura e dados iniciais
│   ├── setup_zero.sql          # Estrutura limpa, sem dados iniciais
│   ├── add_roles_permissions.sql
│   ├── add_questionnaire_tables.sql
│   └── scripts complementares de migração e apoio
├── package.json              # Dependências Node.js
├── .env                      # Variáveis de ambiente
├── init-db.js                 # Atalho para executar o setup principal
└── scripts de migração compatíveis com bases antigas
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

## 📊 Migrações e scripts auxiliares

Os campos historicamente adicionados por scripts separados, como `responsible_relationship` e `photo`, ja fazem parte do schema atual em `setup_completo.sql` e `setup_zero.sql`.

Os scripts que permanecem na raiz do backend servem apenas para compatibilizar bancos mais antigos com o modelo atual.

## 🚀 Como Iniciar

```bash
# Instalar dependências
npm install

# Criar o banco a partir do script principal
# Use Backend/database/setup_completo.sql no MySQL Workbench

# Ou execute o atalho pelo Node.js
node init-db.js

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
Executar o script `database/setup_completo.sql` e, se necessário, as migrações adicionais

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
