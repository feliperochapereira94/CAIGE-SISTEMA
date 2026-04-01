import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'caige'
};

async function tableExists(conn, tableName) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? LIMIT 1`,
    [tableName]
  );
  return rows.length > 0;
}

async function columnExists(conn, tableName, columnName) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
    [tableName, columnName]
  );
  return rows.length > 0;
}

async function indexExists(conn, tableName, indexName) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1`,
    [tableName, indexName]
  );
  return rows.length > 0;
}

async function tryDropIndex(conn, tableName, indexName) {
  try {
    await conn.query(`ALTER TABLE ${tableName} DROP INDEX ${indexName}`);
    console.log(`- indice removido: ${indexName}`);
  } catch (error) {
    // Alguns indices sao obrigatorios por causa de FK. Nesse caso, mantemos o indice.
    console.log(`- indice mantido (${indexName}): ${error.message}`);
  }
}

async function runRenameColumn(conn, tableName, oldName, newName) {
  if (!(await columnExists(conn, tableName, oldName))) return;
  if (await columnExists(conn, tableName, newName)) return;

  await conn.query(`ALTER TABLE ${tableName} RENAME COLUMN ${oldName} TO ${newName}`);
  console.log(`- ${tableName}.${oldName} -> ${newName}`);
}

async function runRenamePermissionColumn(conn, oldName, newName) {
  if (!(await columnExists(conn, 'permissions', oldName))) return;
  if (await columnExists(conn, 'permissions', newName)) return;

  await conn.query(`ALTER TABLE permissions RENAME COLUMN ${oldName} TO ${newName}`);
  console.log(`- permissions.${oldName} -> ${newName}`);
}

async function run() {
  const conn = await mysql.createConnection(connectionConfig);

  try {
    console.log('Iniciando migracao elderly -> patients...');

    const hasElderlyTable = await tableExists(conn, 'elderly');
    const hasPatientsTable = await tableExists(conn, 'patients');

    if (hasElderlyTable && !hasPatientsTable) {
      await conn.query('RENAME TABLE elderly TO patients');
      console.log('- tabela elderly -> patients');
    }

    await runRenameColumn(conn, 'attendance', 'elderly_id', 'patient_id');
    await runRenameColumn(conn, 'medical_records', 'elderly_id', 'patient_id');
    await runRenameColumn(conn, 'questionnaire_responses', 'elderly_id', 'patient_id');

    await runRenamePermissionColumn(conn, 'can_create_elderly', 'can_create_patient');
    await runRenamePermissionColumn(conn, 'can_edit_elderly', 'can_edit_patient');
    await runRenamePermissionColumn(conn, 'can_view_elderly', 'can_view_patient');

    if (await indexExists(conn, 'attendance', 'uniq_attendance_elderly_date')) {
      await tryDropIndex(conn, 'attendance', 'uniq_attendance_elderly_date');
    }

    if (!(await indexExists(conn, 'attendance', 'uniq_attendance_patient_date'))) {
      await conn.query('ALTER TABLE attendance ADD UNIQUE INDEX uniq_attendance_patient_date (patient_id, attendance_date)');
      console.log('- indice criado: uniq_attendance_patient_date');
    }

    if (await indexExists(conn, 'medical_records', 'idx_elderly_id')) {
      await tryDropIndex(conn, 'medical_records', 'idx_elderly_id');
    }

    if (!(await indexExists(conn, 'medical_records', 'idx_patient_id'))) {
      await conn.query('ALTER TABLE medical_records ADD INDEX idx_patient_id (patient_id)');
      console.log('- indice criado: idx_patient_id');
    }

    if (await indexExists(conn, 'questionnaire_responses', 'idx_elderly_questionnaire')) {
      await tryDropIndex(conn, 'questionnaire_responses', 'idx_elderly_questionnaire');
    }

    if (!(await indexExists(conn, 'questionnaire_responses', 'idx_patient_questionnaire'))) {
      await conn.query('ALTER TABLE questionnaire_responses ADD INDEX idx_patient_questionnaire (patient_id, questionnaire_id)');
      console.log('- indice criado: idx_patient_questionnaire');
    }

    console.log('Migracao concluida com sucesso.');
  } catch (error) {
    console.error('Erro na migracao:', error.message);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

run();
