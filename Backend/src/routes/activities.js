import express from "express";
import pool from "../models/database.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /activities - Retorna todas as atividades com filtros opcionais
 * Query params:
 *   - date: YYYY-MM-DD (filtrar por data)
 *   - type: string (filtrar por tipo)
 *   - responsible: string (filtrar por responsável)
 *   - limit: number (limite de resultados)
 *   - offset: number (paginação)
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const { date, type, responsible, limit = 100, offset = 0 } = req.query;

    let query = `SELECT DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS date,
                        type,
                        description,
                        responsible
                 FROM activities
                 WHERE 1=1`;

    const params = [];

    if (date) {
      query += ` AND DATE(created_at) = ?`;
      params.push(date);
    }

    if (type) {
      query += ` AND type = ?`;
      params.push(type);
    }

    if (responsible) {
      query += ` AND responsible LIKE ?`;
      params.push(`%${responsible}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [activities] = await pool.query(query, params);

    // Contar total
    let countQuery = `SELECT COUNT(*) as total FROM activities WHERE 1=1`;
    const countParams = [];

    if (date) {
      countQuery += ` AND DATE(created_at) = ?`;
      countParams.push(date);
    }

    if (type) {
      countQuery += ` AND type = ?`;
      countParams.push(type);
    }

    if (responsible) {
      countQuery += ` AND responsible LIKE ?`;
      countParams.push(`%${responsible}%`);
    }

    const [[{ total }]] = await pool.query(countQuery, countParams);

    return res.status(200).json({
      activities,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < total
    });
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return res.status(500).json({ message: "Erro ao buscar atividades." });
  }
});

export default router;
