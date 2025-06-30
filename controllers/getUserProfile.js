// controllers/authController.js
import User from "../models/userModel.js"; // or wherever your User model is

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error("getUserProfile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
