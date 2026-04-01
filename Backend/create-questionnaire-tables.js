import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createQuestionnaireTables() {
  try {
    // Ler arquivo SQL
    const sqlFile = path.join(__dirname, 'database', 'add_questionnaire_tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    // Executar SQL
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'caige',
      multipleStatements: true
    });

    await connection.query(sql);

    console.log('Tabelas de prontuarios criadas com sucesso!');
    await connection.end();
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    process.exit(1);
  }
}

createQuestionnaireTables();
