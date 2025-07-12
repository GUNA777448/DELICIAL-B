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

// 📧 Send Contact Message
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // 📩 Email to Admin
    const adminMail = {
      from: `"Contact Form 📧" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL || process.env.EMAIL_USER,
      subject: `📧 New Contact Message: ${subject}`,
      html: `
        <div style="font-family: Arial; padding: 20px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 10px;">
          <h2 style="color: #d63636;">New Contact Message</h2>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #6c757d; font-size: 12px;">
            This message was sent from the Delicial contact form.
          </p>
        </div>
      `
    };

    // Send email
    try {
      await transporter.sendMail(adminMail);
      console.log('✅ Contact message email sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      // Don't fail the contact submission if email fails
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon."
    });
  } catch (error) {
    console.error('❌ Error sending contact message:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later."
    });
  }
};
