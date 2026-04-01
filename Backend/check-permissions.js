import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'caige'
});

async function checkTables() {
  try {
    // Listar tabelas
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tabelas no banco:');
    tables.forEach(t => console.log('  -', Object.values(t)[0]));

    // Verificar permissions
    const [columns] = await pool.query('SHOW COLUMNS FROM permissions');
    console.log('\nColunas da tabela permissions:');
    columns.forEach(c => console.log(`  - ${c.Field} (${c.Type})`));

    // Contar dados
    const [perms] = await pool.query('SELECT * FROM permissions');
    console.log(`\nDados na permissions (${perms.length} linhas):`);
    console.log(perms);

    process.exit(0);
  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

checkTables();
