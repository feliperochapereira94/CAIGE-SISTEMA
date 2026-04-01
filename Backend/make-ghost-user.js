import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function makeUserGhost() {
  try {
    console.log('Iniciando configuração de usuário fantasma...\n');

    // 1. Adicionar coluna is_hidden se não existir
    try {
      await pool.query('ALTER TABLE users ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE');
      console.log('✓ Coluna is_hidden adicionada');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ Coluna is_hidden já existe');
      } else {
        throw error;
      }
    }

    // 2. Marcar usuário suportecaige como fantasma
    const [result] = await pool.query(
      'UPDATE users SET is_hidden = TRUE WHERE email = ?',
      ['suportecaige@univale.br']
    );
    
    console.log(`✓ Usuário suportecaige@univale.br marcado como fantasma`);
    console.log(`  Linhas atualizadas: ${result.affectedRows}\n`);

    // 3. Verificar resultado
    const [user] = await pool.query(
      'SELECT id, email, role, is_hidden FROM users WHERE email = ?',
      ['suportecaige@univale.br']
    );

    if (user.length > 0) {
      console.log('Confirmação:');
      console.log(`  Email: ${user[0].email}`);
      console.log(`  Role: ${user[0].role}`);
      console.log(`  É Fantasma: ${user[0].is_hidden ? 'SIM ✓' : 'NÃO'}\n`);
    }

    // 4. Listar usuários não-fantasma
    const [visibleUsers] = await pool.query(
      'SELECT id, email, role, is_hidden FROM users WHERE is_hidden = FALSE ORDER BY id'
    );

    console.log(`Usuários visíveis (${visibleUsers.length}):`);
    visibleUsers.forEach(u => {
      console.log(`  - ${u.email} (${u.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

makeUserGhost();
