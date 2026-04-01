import pool from './src/models/database.js';

const ALLOWED_COURSES = [
  'Fisioterapia',
  'Educação Física',
  'Agronomia',
  'Farmácia',
  'Enfermagem',
  'Medicina',
  'Estética e Cosmética',
  'Fonoaudiologia',
  'Nutrição'
];

async function migrateMedicalRecordsCourses() {
  try {
    const enumValues = ALLOWED_COURSES.map((course) => `'${course}'`).join(', ');

    // Normaliza registros antigos fora da lista para não quebrar o ALTER.
    await pool.query(
      `UPDATE medical_records
       SET specialty = 'Medicina'
       WHERE specialty NOT IN (${enumValues}) OR specialty IS NULL OR specialty = ''`
    );

    await pool.query(
      `ALTER TABLE medical_records
       MODIFY COLUMN specialty ENUM(${enumValues}) NOT NULL`
    );

    console.log('✓ Coluna specialty migrada para ENUM de cursos com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Erro na migração de cursos do prontuário:', error.message);
    process.exit(1);
  }
}

migrateMedicalRecordsCourses();
