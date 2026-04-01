import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'caige',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function migrateAddPhoto() {
  try {
    // Adicionar coluna photo
    try {
      await pool.query(`
        ALTER TABLE patients 
        ADD COLUMN photo LONGTEXT AFTER responsible_phone
      `);
      console.log('✓ Coluna photo adicionada à tabela patients');
    } catch (error) {
      if (error.message.includes('Duplicate column')) {
        console.log('ℹ A coluna photo já existe na tabela');
      } else {
        throw error;
      }
    }

    console.log('✓ Migração concluída!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Erro na migração:', error.message);
    process.exit(1);
  }
}

migrateAddPhoto();
