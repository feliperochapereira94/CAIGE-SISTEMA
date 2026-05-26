import pool from "./database.js";

export async function logActivity(type, description, responsible = "Sistema") {
  try {
    await pool.query(
      `INSERT INTO activities (type, description, responsible, created_at)
       VALUES (?, ?, ?, NOW())`,
      [type, description, responsible]
    );
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
  }
}
