import express from "express";
const router = express.Router();

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

// 🛒 User Routes
router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);

// 👑 Admin Routes
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
