import express from "express";
import { requireAuth, requireSupervisor } from "../controllers/acessoController.js";
import { listArchivedPatients, listArchivedUsers } from "../controllers/arquivoController.js";

const router = express.Router();

router.get("/usuarios", requireAuth, requireSupervisor, listArchivedUsers);

router.get("/pacientes", requireAuth, requireSupervisor, listArchivedPatients);

export default router;

