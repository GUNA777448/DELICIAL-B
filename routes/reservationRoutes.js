import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createReservation,
  getMyReservations,
} from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", protect, createReservation); // POST /api/reservations
router.get("/my", protect, getMyReservations); // GET /api/reservations/my

export default router;
