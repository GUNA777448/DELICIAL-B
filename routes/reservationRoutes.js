import express from "express";
import { createReservation, getUserReservations } from "../controllers/reservationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create reservation (authentication optional)
router.post("/", createReservation);

// Get user's reservations (authentication required)
router.get("/my-reservations", protect, getUserReservations);

export default router;
