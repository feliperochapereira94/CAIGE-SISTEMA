import express from "express";
import { requireAuth } from "../controllers/accessController.js";
import { getActivities } from "../controllers/activitiesController.js";

const router = express.Router();

router.get("/", requireAuth, getActivities);

export default router;
