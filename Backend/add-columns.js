import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function addColumns() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN name VARCHAR(255)');
    console.log('✓ Coluna name adicionada');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('→ Coluna name já existe');
    } else {
      console.error('Erro ao adicionar coluna name:', e.message);
    }
  }

  try {
    await pool.query('ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL');
    console.log('✓ Coluna last_login adicionada');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('→ Coluna last_login já existe');
    } else {
      console.error('Erro ao adicionar coluna last_login:', e.message);
    }
  }

  process.exit();
}

addColumns();
