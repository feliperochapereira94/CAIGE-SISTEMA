import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function addRelationshipColumn() {
  try {
    console.log('Conectando ao MySQL...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'caige'
    });

    console.log('Conectado com sucesso!');

    console.log('Adicionando coluna responsible_relationship...');
    try {
      await connection.query(
        'ALTER TABLE patients ADD COLUMN responsible_relationship VARCHAR(50) AFTER responsible'
      );
      console.log('✓ Coluna adicionada com sucesso!');
    } catch (error) {
      // Coluna já existe, ignora o erro
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ Coluna já existe, continuando...');
      } else {
        throw error;
      }
    }

    await connection.end();
    console.log('\n✓ Migração concluída!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

addRelationshipColumn();
