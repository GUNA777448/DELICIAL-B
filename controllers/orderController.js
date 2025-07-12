import Order from "../models/orderModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ✉️ Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 Place an Order (User)
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, deliveryAddress, paymentStatus } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentStatus || "Pending",
      deliveryAddress: {
        name: deliveryAddress.name,
        phone: deliveryAddress.phone,
        email: deliveryAddress.email,
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        pincode: deliveryAddress.pincode,
      },
    });

    await order.populate("user", "name email");

    // 📩 Email to User
    const userMail = {
      from: `"Delicial 🍴" <${process.env.EMAIL_USER}>`,
      to: deliveryAddress.email,
      subject: "🛒 Your Delicial Order Confirmation",
      html: `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #e8e8e8; background: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #d63636;">Hi ${deliveryAddress.name},</h2>
          <p>Thank you for your order from <strong>Delicial</strong>!</p>
          <p><strong>Order Details:</strong></p>
          <ul>
            ${items
              .map(
                (item) =>
                  `<li>${item.name} - Qty: ${item.qty} - ₹${item.price}</li>`
              )
              .join("")}
          </ul>
          <p><strong>Total:</strong> ₹${totalAmount}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Delivery Address:</strong> ${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.pincode}</p>
          <p>We’ll notify you when your order is out for delivery!</p>
          <br/>
          <p>Thanks again, <br/> <strong>Delicial Team 🍽️</strong></p>
        </div>
      `,
    };

    // 📩 Email to Admin (Delicial)
    const adminMail = {
      from: `"Delicial Bot 🤖" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: `📦 New Order from ${deliveryAddress.name}`,
      html: `
        <div style="font-family: Arial; padding: 20px; background: #fff3f3; border: 1px solid #ffcaca; border-radius: 10px;">
          <h2>📬 New Order Notification</h2>
          <p><strong>Customer:</strong> ${deliveryAddress.name}</p>
          <p><strong>Email:</strong> ${deliveryAddress.email}</p>
          <p><strong>Phone:</strong> ${deliveryAddress.phone}</p>
          <p><strong>Items:</strong></p>
          <ul>
            ${items
              .map(
                (item) =>
                  `<li>${item.name} - Qty: ${item.qty} - ₹${item.price}</li>`
              )
              .join("")}
          </ul>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Delivery Address:</strong> ${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.pincode}</p>
        </div>
      `,
    };

    // Send both emails in parallel (with error handling)
    try {
      await Promise.all([
        transporter.sendMail(userMail),
        transporter.sendMail(adminMail),
      ]);
      console.log('✅ Order confirmation emails sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      // Don't fail the order if email fails
      // In production, you might want to queue emails for retry
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully and emails sent!",
      order,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

// 📌 Get My Orders (User)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// 📌 Get All Orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// 📌 Update Order Status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};
