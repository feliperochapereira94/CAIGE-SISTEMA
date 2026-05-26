import express from "express";
import { requireAuth, requireSupervisor } from "../controllers/accessController.js";
import { listArchivedPatients, listArchivedUsers } from "../controllers/archiveController.js";

const router = express.Router();

router.get("/users", requireAuth, requireSupervisor, listArchivedUsers);

router.get("/patients", requireAuth, requireSupervisor, listArchivedPatients);

export default router;
