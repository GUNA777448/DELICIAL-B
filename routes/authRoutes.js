// routes/authRoutes.js
import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

// ✅ ADD THIS: Authenticated user info
router.get("/me", protect, getUserProfile);

export default router;
