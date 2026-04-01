import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function hasColumn(tableName, columnName) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );

  return rows[0]?.total > 0;
}

async function hasIndex(tableName, indexName) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [tableName, indexName]
  );

  return rows[0]?.total > 0;
}

async function migrateAttendance() {
  try {
    if (!(await hasColumn('attendance', 'attendance_date'))) {
      await pool.query('ALTER TABLE attendance ADD COLUMN attendance_date DATE NULL AFTER check_in_time');
      console.log('✓ Coluna attendance_date adicionada');
    } else {
      console.log('→ Coluna attendance_date já existe');
    }

    await pool.query('UPDATE attendance SET attendance_date = DATE(check_in_time) WHERE attendance_date IS NULL');
    console.log('✓ Datas de presença preenchidas');

    const [duplicates] = await pool.query(`
      SELECT patient_id, attendance_date, COUNT(*) AS total
      FROM attendance
      GROUP BY patient_id, attendance_date
      HAVING COUNT(*) > 1
    `);

    if (duplicates.length > 0) {
      console.error('❌ Existem presenças duplicadas para o mesmo paciente no mesmo dia. Resolva antes de aplicar a unicidade:');
      duplicates.forEach((item) => {
        console.error(`- patient_id=${item.patient_id} data=${item.attendance_date} total=${item.total}`);
      });
      process.exit(1);
    }

    await pool.query('ALTER TABLE attendance MODIFY COLUMN attendance_date DATE NOT NULL');
    console.log('✓ Coluna attendance_date marcada como obrigatória');

    if (!(await hasIndex('attendance', 'uniq_attendance_patient_date'))) {
      await pool.query('ALTER TABLE attendance ADD UNIQUE INDEX uniq_attendance_patient_date (patient_id, attendance_date)');
      console.log('✓ Índice único de presença diária criado');
    } else {
      console.log('→ Índice único de presença diária já existe');
    }

    if (!(await hasIndex('attendance', 'idx_attendance_date'))) {
      await pool.query('ALTER TABLE attendance ADD INDEX idx_attendance_date (attendance_date)');
      console.log('✓ Índice por data de presença criado');
    } else {
      console.log('→ Índice idx_attendance_date já existe');
    }

    if (await hasColumn('permissions', 'can_check_out')) {
      await pool.query('ALTER TABLE permissions DROP COLUMN can_check_out');
      console.log('✓ Coluna can_check_out removida da tabela permissions');
    } else {
      console.log('→ Coluna can_check_out já não existe');
    }

    console.log('✅ Migração de frequência concluída');
  } catch (error) {
    console.error('❌ Erro na migração de frequência:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateAttendance();