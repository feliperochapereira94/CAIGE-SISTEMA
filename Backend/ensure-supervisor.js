import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';

async function ensureSupervisor() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'caige'
  });

  try {
    console.log('Verificando usuário supervisor...');

    // Verificar se o usuário existe
    const [users] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      ['suportecaige@univale.br']
    );

    if (users.length === 0) {
      console.log('Criando usuário supervisor...');
      
      // Senha padrão: suporte123
      const hashedPassword = await bcryptjs.hash('suporte123', 10);
      
      await connection.execute(
        "INSERT INTO users (email, password_hash, role, is_active, created_at) VALUES (?, ?, ?, TRUE, NOW())",
        ['suportecaige@univale.br', hashedPassword, 'SUPERVISOR']
      );
      
      console.log('✅ Usuário supervisor criado com sucesso!');
      console.log('📧 Email: suportecaige@univale.br');
      console.log('🔑 Senha: suporte123');
    } else {
      console.log('✅ Usuário supervisor já existe!');
      console.log('📧 Email:', users[0].email);
      console.log('👤 Role:', users[0].role);
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await connection.end();
  }
}

ensureSupervisor();
