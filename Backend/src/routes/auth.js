import express from "express";
import { login, changePassword, getUserProfile, updateUserProfile } from "../controllers/authController.js";
import { requireAuth } from "../controllers/accessController.js";

const router = express.Router();

router.post("/login", login);
router.post("/change-password", requireAuth, changePassword);
router.get("/profile", requireAuth, getUserProfile);
router.put("/profile", requireAuth, updateUserProfile);

export default router;
