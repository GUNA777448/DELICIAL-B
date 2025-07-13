// controllers/authController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  console.log("Register user request body:", req.body);
  console.log("Register user headers:", req.headers);
  
  const { name, email, password } = req.body;

  console.log("Extracted data:", { name, email, password: password ? '[HIDDEN]' : 'undefined' });

  if (!name || !email || !password) {
    console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password });
    res.status(400);
    throw new Error("Missing required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    console.log("User already exists:", email);
    res.status(400);
    throw new Error("User already exists");
  }

  console.log("Creating new user...");
  const user = await User.create({ name, email, password });

  if (user) {
    console.log("User created successfully:", user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    console.log("Failed to create user");
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({ user });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
