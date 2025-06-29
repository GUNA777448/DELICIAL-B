import asyncHandler from "express-async-handler";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.gender = req.body.gender || user.gender;
    user.age = req.body.age || user.age;
    user.profilePic = req.body.profilePic || user.profilePic;

    if (req.body.address) {
      user.address = {
        ...user.address,
        ...req.body.address,
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      age: updatedUser.age,
      profilePic: updatedUser.profilePic,
      address: updatedUser.address,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// POST /api/users/favorites
export const addFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const item = req.body;

  const exists = user.favorites.find((fav) => fav.name === item.name);
  if (exists) return res.status(400).json({ message: "Already in favorites" });

  user.favorites.push(item);
  await user.save();
  res.status(200).json(user.favorites);
});

// DELETE /api/users/favorites/:name
export const removeFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter((fav) => fav.name !== req.params.name);
  await user.save();
  res.status(200).json(user.favorites);
});

// GET /api/users/favorites
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user.favorites);
});
