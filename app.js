import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
//! Import routes

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

// Import order routes
dotenv.config();

// Set default environment variables if not present
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "delicial_jwt_secret_key_2024_very_secure_and_unique";
  console.log("⚠️  JWT_SECRET not found, using default");
}

if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = "mongodb://localhost:27017/delicial";
  console.log("⚠️  MONGO_URI not found, using default");
}

const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
// Routes
// Add contact routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes); // Add reservation routes
app.use("/api/orders", orderRoutes); // Add order routes
app.use("/api/cart", cartRoutes); // Add cart routes

// Sample Route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Start Server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
