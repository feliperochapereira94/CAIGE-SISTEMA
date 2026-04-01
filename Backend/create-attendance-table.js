import mysql from 'mysql2/promise';

try {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'caige'
  });

  const sql = `CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    professional_id INT,
    check_in_time DATETIME NOT NULL,
    attendance_date DATE NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE SET NULL,
    UNIQUE KEY uniq_attendance_patient_date (patient_id, attendance_date),
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_check_in_time (check_in_time)
  )`;

  await connection.query(sql);
  console.log('✓ Tabela attendance criada com sucesso');
  await connection.end();
} catch (error) {
  if (error.code === 'ER_TABLE_EXISTS_ERROR') {
    console.log('✓ Tabela attendance já existe');
  } else {
    console.error('Erro:', error.message);
  }
  process.exit(1);
}
