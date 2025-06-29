import express from "express";
import {
  toggleFavorite,
  getFavorites,
} from "../controllers/favoriteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getFavorites);
router.route("/:itemId").post(protect, toggleFavorite);

export default router;
