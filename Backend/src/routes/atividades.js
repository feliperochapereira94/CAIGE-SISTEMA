import express from "express";
import { requireAuth } from "../controllers/acessoController.js";
import { getActivities } from "../controllers/atividadesController.js";

const router = express.Router();

router.get("/", requireAuth, getActivities);

export default router;

