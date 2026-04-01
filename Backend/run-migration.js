import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'caige'
  });

  try {
    console.log('Executando migração de roles e permissões...');

    const migrationPath = path.join(__dirname, 'database', 'add_roles_permissions.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Dividir múltiplos statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      try {
        console.log(`Executando: ${statement.substring(0, 60)}...`);
        await connection.execute(statement);
        console.log('✅ OK');
      } catch (err) {
        // Ignorar erros de coluna/tabela já existente
        if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_ENTRY') {
          console.log('⚠️ Campo/tabela já existe, continuando...');
        } else {
          throw err;
        }
      }
    }

    console.log('✅ Migração de roles e permissões completa!');
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error.message);
  } finally {
    await connection.end();
  }
}

runMigration();
