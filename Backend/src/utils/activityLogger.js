import pool from "../models/database.js";

/**
 * Registra uma atividade na tabela activities
 * @param {string} type - Tipo de atividade (ex: "Novo Cadastro", "Edição", "Deleção")
 * @param {string} description - Descrição detalhada
 * @param {string} responsible - Quem realizou a ação
 */
export async function logActivity(type, description, responsible = "Sistema") {
  try {
    await pool.query(
      `INSERT INTO activities (type, description, responsible, created_at)
       VALUES (?, ?, ?, NOW())`,
      [type, description, responsible]
    );
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
    // Não falha a operação principal se o log falhar
  }
}
