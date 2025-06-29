import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Add or remove item from favorites
export const toggleFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { itemId } = req.params;

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const index = user.favorites.indexOf(itemId);

  if (index > -1) {
    user.favorites.splice(index, 1);
    await user.save();
    res.json({ message: "Item removed from favorites" });
  } else {
    user.favorites.push(itemId);
    await user.save();
    res.json({ message: "Item added to favorites" });
  }
});

// Get all favorites
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("favorites");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.favorites);
});
