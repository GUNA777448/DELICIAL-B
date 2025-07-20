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
  
  const { name, email, password, firebaseToken, userData } = req.body;

  console.log("Extracted data:", { name, email, password: password ? '[HIDDEN]' : 'undefined', firebaseToken: !!firebaseToken });

  // Handle Firebase authentication
  if (firebaseToken && userData) {
    console.log("Processing Firebase authentication...");
    
    const { email: firebaseEmail, name: firebaseName, photoURL } = userData;
    
    if (!firebaseEmail) {
      res.status(400);
      throw new Error("Email is required for Firebase authentication");
    }

    // Check if user exists
    let user = await User.findOne({ email: firebaseEmail });
    
    if (!user) {
      // Create new user from Firebase data
      console.log("Creating new user from Firebase:", firebaseEmail);
      user = await User.create({
        name: firebaseName || firebaseEmail.split('@')[0],
        email: firebaseEmail,
        password: `firebase_${Date.now()}`, // Dummy password for Firebase users
        profilePic: photoURL
      });
    } else {
      // Update existing user's profile picture if available
      if (photoURL && !user.profilePic) {
        user.profilePic = photoURL;
        await user.save();
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);
    
    console.log("Firebase user authenticated:", user._id);
    
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: token,
    });
  }

  // Handle regular signup
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

// @desc    Authenticate Firebase user & get JWT token
// @route   POST /api/auth/firebase
// @access  Public
export const authenticateFirebaseUser = asyncHandler(async (req, res) => {
  console.log("Firebase auth request body:", req.body);
  
  const { firebaseToken, userData } = req.body;

  if (!firebaseToken || !userData) {
    res.status(400);
    throw new Error("Firebase token and user data required");
  }

  try {
    // Verify Firebase token (you can add Firebase Admin SDK verification here)
    // For now, we'll trust the client and use the user data
    
    const { email, name, photoURL } = userData;
    
    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user from Firebase data
      console.log("Creating new user from Firebase:", email);
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: `firebase_${Date.now()}`, // Dummy password for Firebase users
        profilePic: photoURL
      });
    } else {
      // Update existing user's profile picture if available
      if (photoURL && !user.profilePic) {
        user.profilePic = photoURL;
        await user.save();
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);
    
    console.log("Firebase user authenticated:", user._id);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: token,
    });
  } catch (error) {
    console.error("Firebase auth error:", error);
    res.status(400);
    throw new Error("Firebase authentication failed");
  }
});
