import express from "express";
import {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient
} from "../controllers/patientController.js";
import { requireAuth, requirePermission } from "../middleware/auth.js";

const router = express.Router();

// Listar todos os pacientes - requer can_view_patient
router.get("/", requireAuth, requirePermission('can_view_patient'), getAllPatients);

// Obter paciente específico - requer can_view_patient
router.get("/:id", requireAuth, requirePermission('can_view_patient'), getPatient);

// Criar novo paciente - requer can_create_patient
router.post("/", requireAuth, requirePermission('can_create_patient'), createPatient);

// Atualizar paciente - requer can_edit_patient
router.put("/:id", requireAuth, requirePermission('can_edit_patient'), updatePatient);

// Desabilitar paciente definitivamente (arquivar) - requer can_edit_patient
router.delete("/:id", requireAuth, requirePermission('can_edit_patient'), deletePatient);

export default router;
