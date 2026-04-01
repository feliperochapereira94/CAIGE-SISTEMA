import pool from './src/models/database.js';

async function createMedicalRecordsTable() {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS medical_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        specialty ENUM(
          'Fisioterapia',
          'Educação Física',
          'Agronomia',
          'Farmácia',
          'Enfermagem',
          'Medicina',
          'Estética e Cosmética',
          'Fonoaudiologia',
          'Nutrição'
        ) NOT NULL,
        notes LONGTEXT,
        file_path VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_size INT,
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_patient_id (patient_id),
        INDEX idx_specialty (specialty),
        INDEX idx_created_at (created_at)
      );
    `;

    await pool.query(createTableSQL);
    console.log('✓ Tabela medical_records criada com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Erro ao criar tabela:', error.message);
    process.exit(1);
  }
}

createMedicalRecordsTable();
