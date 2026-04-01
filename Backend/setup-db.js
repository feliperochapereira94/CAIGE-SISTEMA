import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    console.log('Conectando ao MySQL...');
    
    // Conectar ao MySQL sem banco de dados específico
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root'
    });

    console.log('Conectado com sucesso!');

    // Ler arquivo SQL
    const sqlFile = fs.readFileSync(path.join(__dirname, 'database', 'setup.sql'), 'utf8');
    
    // Dividir em statements
    const statements = sqlFile.split(';').filter(stmt => stmt.trim());

    // Executar cada statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          console.log(`Executando: ${statement.trim().substring(0, 50)}...`);
          await connection.query(statement);
          console.log('✓ OK');
        } catch (error) {
          console.error('✗ Erro:', error.message);
        }
      }
    }

    await connection.end();
    console.log('\n✓ Banco de dados configurado com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

setupDatabase();
