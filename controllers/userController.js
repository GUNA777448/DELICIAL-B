import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Validate input fields
  const { name, phone, gender, age, profilePic, address } = req.body;

  // Validate name
  if (name !== undefined) {
    if (!name.trim()) {
      res.status(400);
      throw new Error("Name cannot be empty");
    }
    if (name.length < 2) {
      res.status(400);
      throw new Error("Name must be at least 2 characters long");
    }
    user.name = name.trim();
  }

  // Validate phone
  if (phone !== undefined) {
    if (phone && phone.length < 10) {
      res.status(400);
      throw new Error("Phone number must be at least 10 digits");
    }
    user.phone = phone;
  }

  // Validate gender
  if (gender !== undefined) {
    const validGenders = ['male', 'female', 'other', 'prefer not to say'];
    if (gender && !validGenders.includes(gender.toLowerCase())) {
      res.status(400);
      throw new Error("Please select a valid gender");
    }
    user.gender = gender;
  }

  // Validate age
  if (age !== undefined) {
    const ageNum = parseInt(age);
    if (age && (isNaN(ageNum) || ageNum < 1 || ageNum > 120)) {
      res.status(400);
      throw new Error("Please enter a valid age between 1 and 120");
    }
    user.age = ageNum || null;
  }

  // Validate profile picture URL
  if (profilePic !== undefined) {
    if (profilePic && !isValidUrl(profilePic)) {
      res.status(400);
      throw new Error("Please enter a valid profile picture URL");
    }
    user.profilePic = profilePic;
  }

  // Update address if provided
  if (address) {
      user.address = {
        ...user.address,
      ...address,
      };
    }

    const updatedUser = await user.save();

  // Update localStorage user data if needed
  const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      age: updatedUser.age,
      profilePic: updatedUser.profilePic,
      address: updatedUser.address,
      isAdmin: updatedUser.isAdmin,
  };

  res.json({
    message: "Profile updated successfully",
    user: userResponse,
  });
});

// Helper function to validate URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
// POST /api/users/favorites
export const addFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const item = req.body;

  const exists = user.favorites.find((fav) => fav.name === item.name);
  if (exists) return res.status(400).json({ message: "Already in favorites" });

  user.favorites.push(item);
  await user.save();
  res.status(200).json(user.favorites);
});

// DELETE /api/users/favorites/:name
export const removeFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.favorites = user.favorites.filter((fav) => fav.name !== req.params.name);
  await user.save();
  res.status(200).json(user.favorites);
});

// GET /api/users/favorites
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json(user.favorites);
});
