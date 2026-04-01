import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import mysql from 'mysql2/promise';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function createTestUsers() {
  try {
    console.log('Criando usuários de teste visíveis...\n');

    const testUsers = [
      {
        email: 'professor@univale.br',
        password: '123456',
        role: 'PROFESSOR',
        sector: 'Fisioterapia'
      },
      {
        email: 'professor2@univale.br',
        password: '123456',
        role: 'PROFESSOR',
        sector: 'Educação Física'
      }
    ];

    for (const user of testUsers) {
      try {
        // Verificar se já existe
        const [existing] = await pool.query(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );

        if (existing.length > 0) {
          console.log(`⚠️  ${user.email} já existe`);
          continue;
        }

        // Hash da senha
        const hashedPassword = await bcryptjs.hash(user.password, 10);

        // Pegar ID do usuário criador (super)
        const [creator] = await pool.query(
          'SELECT id FROM users WHERE email = ?',
          ['suportecaige@univale.br']
        );

        // Inserir novo usuário
        await pool.query(
          'INSERT INTO users (email, password_hash, role, sector, created_by, is_active, is_hidden) VALUES (?, ?, ?, ?, ?, TRUE, FALSE)',
          [user.email, hashedPassword, user.role, user.sector, creator[0].id]
        );

        console.log(`✓ ${user.email} criado (${user.role})`);
      } catch (error) {
        console.error(`❌ Erro ao criar ${user.email}:`, error.message);
      }
    }

    // Listar usuários visíveis
    console.log('\n📋 Usuários visíveis:');
    const [visibleUsers] = await pool.query(
      'SELECT email, role, sector FROM users WHERE is_hidden = FALSE OR is_hidden IS NULL'
    );

    console.log(`Total: ${visibleUsers.length}`);
    visibleUsers.forEach(u => {
      console.log(`  ✓ ${u.email} (${u.role}) - ${u.sector}`);
    });

    // Confirmar usuário fantasma existe mas está oculto
    console.log('\n👻 Verificação do usuário fantasma:');
    const [ghostUser] = await pool.query(
      'SELECT email, role, is_hidden FROM users WHERE email = ?',
      ['suportecaige@univale.br']
    );

    if (ghostUser.length > 0) {
      console.log(`  ✓ ${ghostUser[0].email} existe (is_hidden: ${ghostUser[0].is_hidden})`);
      console.log(`  📍 Ele tem acesso total ao sistema`);
      console.log(`  🕵️  Mas não aparece na listagem de usuários`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

createTestUsers();
