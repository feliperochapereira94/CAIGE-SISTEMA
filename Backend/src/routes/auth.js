import express from "express";
import { login, changePassword, getUserProfile, updateUserProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/change-password", changePassword);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

export default router;
