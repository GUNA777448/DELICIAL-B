import Order from "../models/orderModel.js";

// 📌 Place an Order (User)
export const placeOrder = async (req, res) => {
  const { items, totalAmount, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items provided" });
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    totalAmount,
    paymentMethod,
  });

  res.status(201).json(order);
};

// 📌 Get My Orders (User)
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// 📌 Get All Orders (Admin only)
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
};

// 📌 Update Order Status (Admin only)
export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  const updatedOrder = await order.save();

  res.json(updatedOrder);
};
