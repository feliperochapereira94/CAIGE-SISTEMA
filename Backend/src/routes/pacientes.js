import express from "express";
import {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient
} from "../controllers/pacientesController.js";
import { requireAuth, requirePermission } from "../controllers/acessoController.js";

const router = express.Router();

// Listar todos os pacientes - requer pode_visualizar_paciente
router.get("/", requireAuth, requirePermission('pode_visualizar_paciente'), getAllPatients);

// Obter paciente especÃ­fico - requer pode_visualizar_paciente
router.get("/:id", requireAuth, requirePermission('pode_visualizar_paciente'), getPatient);

// Criar novo paciente - requer pode_criar_paciente
router.post("/", requireAuth, requirePermission('pode_criar_paciente'), createPatient);

// Atualizar paciente - requer pode_editar_paciente
router.put("/:id", requireAuth, requirePermission('pode_editar_paciente'), updatePatient);

// Desabilitar paciente definitivamente - requer pode_editar_paciente
router.delete("/:id", requireAuth, requirePermission('pode_editar_paciente'), deletePatient);

export default router;

