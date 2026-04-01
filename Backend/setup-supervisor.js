import mysql from 'mysql2/promise';

async function setupSupervisor() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'caige'
  });

  try {
    console.log('Atualizando usuário supervisor...');

    // Atualizar o email padrão como SUPERVISOR
    await connection.execute(
      "UPDATE users SET role = 'SUPERVISOR' WHERE email = 'suportecaige@univale.br'"
    );

    console.log('✅ Usuário supervisor configurado com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await connection.end();
  }
}

setupSupervisor();
