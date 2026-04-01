import express from "express";
import pool from "../models/database.js";
import { requireAuth, requireSupervisor } from "../middleware/auth.js";
import { getPatientSchema } from "../utils/schemaNames.js";

const router = express.Router();

router.get("/users", requireAuth, requireSupervisor, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, role, sector, is_active, is_hidden,
              DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS created_at
       FROM users
       WHERE is_hidden = TRUE OR is_active = FALSE
       ORDER BY created_at DESC`
    );

    return res.status(200).json({ archived_users: rows });
  } catch (error) {
    console.error("Erro ao buscar usuarios arquivados:", error);
    return res.status(500).json({ message: "Erro ao buscar usuarios arquivados." });
  }
});

router.get("/patients", requireAuth, requireSupervisor, async (req, res) => {
  try {
    const { patientTable } = await getPatientSchema();
    const [rows] = await pool.query(
      `SELECT id, name, cpf, phone, phone2, status,
              DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS created_at
       FROM ${patientTable}
       WHERE status = 'archived'
       ORDER BY created_at DESC`
    );

    return res.status(200).json({ archived_patients: rows });
  } catch (error) {
    console.error("Erro ao buscar pacientes arquivados:", error);
    return res.status(500).json({ message: "Erro ao buscar pacientes arquivados." });
  }
});

export default router;
