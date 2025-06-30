import Cart from "../models/cartModel.js";

// Add or update cart
export const updateCart = async (req, res) => {
  const userId = req.user._id;
  const { items } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({ user: userId, items });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};
