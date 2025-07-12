import Cart from "../models/cartModel.js";

export const getCart = async (req, res) => {
  try {
    console.log("🛒 Getting cart for user:", req.user._id);
    const cart = await Cart.findOne({ user: req.user._id });
    console.log("📦 Cart found:", cart ? "Yes" : "No");
    res.json(cart || { items: [] });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    console.log("➕ Adding to cart for user:", req.user._id);
    console.log("📝 Request body:", req.body);
    
    const { productId, name, price, quantity = 1 } = req.body;

    // Validate required fields
    if (!productId || !name || !price) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        message: "Product ID, name, and price are required" 
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    console.log("🛒 Existing cart found:", cart ? "Yes" : "No");

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      console.log("🆕 Created new cart");
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
      console.log("📈 Updated existing item quantity");
    } else {
      // Add new item
      cart.items.push({ 
        productId, 
        name, 
        price, 
        quantity,
        image: req.body.image || null
      });
      console.log("🆕 Added new item to cart");
    }

    await cart.save();
    console.log("💾 Cart saved successfully");
    res.status(200).json(cart);
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    console.log("➖ Removing from cart for user:", req.user._id);
    const { productId } = req.body;

    if (!productId) {
      console.log("❌ Product ID is required");
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = cart.items.filter((item) => item.productId !== productId);
      await cart.save();
      console.log("✅ Item removed from cart");
    }

    res.status(200).json(cart || { items: [] });
  } catch (error) {
    console.error("❌ Error removing from cart:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    console.log("🗑️ Clearing cart for user:", req.user._id);
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
      cart.items = [];
      await cart.save();
      console.log("✅ Cart cleared successfully");
    }
    
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
