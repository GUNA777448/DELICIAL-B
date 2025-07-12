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
import { sendContactMessage } from "./controllers/contactController.js";

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

// Production environment checks
if (process.env.NODE_ENV === 'production') {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("⚠️  Email credentials not configured for production");
  }
  if (!process.env.TO_EMAIL) {
    console.log("⚠️  Admin email not configured for production");
  }
}

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL, 'https://delcial-f.vercel.app/'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
// Routes
// Add contact routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes); // Add reservation routes
app.use("/api/orders", orderRoutes); // Add order routes
app.use("/api/cart", cartRoutes); // Add cart routes
app.post("/api/contact", sendContactMessage); // Add contact route

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
