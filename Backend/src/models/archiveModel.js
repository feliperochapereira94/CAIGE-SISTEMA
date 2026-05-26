import pool from "./database.js";
import { getPatientSchema } from "./schemaModel.js";

export async function getArchivedUsers() {
  const [rows] = await pool.query(
    `SELECT id, email, role, sector, is_active, is_hidden,
            DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS created_at
     FROM users
     WHERE is_hidden = TRUE OR is_active = FALSE
     ORDER BY created_at DESC`
  );

  return rows;
}

export async function getArchivedPatients() {
  const { patientTable } = await getPatientSchema();
  const [rows] = await pool.query(
    `SELECT id, name, cpf, phone, phone2, status,
            DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS created_at
     FROM ${patientTable}
     WHERE status = 'archived'
     ORDER BY created_at DESC`
  );

  return rows;
}
