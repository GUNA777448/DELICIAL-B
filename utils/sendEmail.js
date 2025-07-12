import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // or use SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmationEmail = async (to, order) => {
  const mailOptions = {
    from: `"Delicial" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Delicial Order Confirmation",
    html: `
      <h2>Hi ${order.deliveryAddress.name},</h2>
      <p>Thank you for your order at <strong>Delicial</strong>!</p>
      <p>Here are your order details:</p>
      <ul>
        ${order.orderItems.map(item => `
          <li>${item.name} - Qty: ${item.qty} - ₹${item.price}</li>
        `).join("")}
      </ul>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>Delivery To:</strong> ${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.pincode}</p>
      <p>We'll notify you when it's on the way!</p>
      <br/>
      <p>Thanks,<br/>The Delicial Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
