import pool from "./database.js";

export async function getPatientById(schema, patientId) {
  const [patients] = await pool.query(
    `SELECT id, name FROM ${schema.patientTable} WHERE id = ?`,
    [patientId]
  );

  return patients[0] || null;
}

export async function getRecordsByPatientId(schema, patientId) {
  const [records] = await pool.query(
    `SELECT
      id,
      ${schema.medicalRecordPatientColumn} AS patient_id,
      specialty,
      notes,
      file_path,
      file_name,
      file_size,
      created_at,
      uploaded_by
     FROM medical_records
     WHERE ${schema.medicalRecordPatientColumn} = ?
     ORDER BY created_at DESC`,
    [patientId]
  );

  return records;
}

export async function isValidCourse(specialty) {
  const [validCourses] = await pool.query(
    "SELECT id FROM courses WHERE name = ? AND is_active = TRUE",
    [specialty]
  );

  return validCourses.length > 0;
}

export async function createRecord(schema, payload) {
  const [result] = await pool.query(
    `INSERT INTO medical_records
     (${schema.medicalRecordPatientColumn}, specialty, notes, file_path, file_name, file_size, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.patientId,
      payload.specialty,
      payload.notes,
      payload.filePath,
      payload.fileName,
      payload.fileSize,
      payload.uploadedBy
    ]
  );

  return result.insertId;
}

export async function getRecordById(recordId) {
  const [records] = await pool.query(
    "SELECT * FROM medical_records WHERE id = ?",
    [recordId]
  );

  return records[0] || null;
}

export async function deleteRecordById(recordId) {
  await pool.query("DELETE FROM medical_records WHERE id = ?", [recordId]);
}
