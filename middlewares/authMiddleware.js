import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;
  
  console.log("🔐 Auth middleware called");
  console.log("Headers:", req.headers.authorization);
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("📝 Token extracted:", token ? "Token exists" : "No token");
      console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token decoded successfully:", decoded);
      
      req.user = await User.findById(decoded.userId).select("-password");
      console.log("👤 User found:", req.user ? "Yes" : "No");
      
      if (!req.user) {
        console.log("❌ User not found in database");
        return res.status(401).json({ message: "User not found" });
      }
      
      next(); // ✅ continue to route
    } catch (error) {
      console.log("❌ Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("❌ No Bearer token found");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};
