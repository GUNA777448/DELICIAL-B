import Reservation from "../models/reservationModel.js";
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

// 📌 Create Reservation (User)
export const createReservation = async (req, res) => {
  try {
    const { restaurant, name, email, phone, date, time, guests, requests } = req.body;

    if (!restaurant || !name || !email || !phone || !date || !time) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const reservation = await Reservation.create({
      restaurant,
      name,
      email,
      phone,
      date,
      time,
      guests: guests || 2,
      requests: requests || ""
    });

    // 💌 Email to User
    const userMail = {
      from: `\"Delicial 🍱\" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🍽️ Your Table Reservation is Confirmed!",
      html: `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #ffdcb2; background: #fffaf2; border-radius: 10px; max-width: 600px; margin: auto;">
          <h2 style="color: #d63636; text-align: center;">Reservation Confirmation</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your table reservation has been confirmed! Here are the details:</p>
          <ul>
            <li><strong>Restaurant:</strong> ${restaurant}</li>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
            <li><strong>Number of Guests:</strong> ${guests || 2}</li>
            <li><strong>Contact:</strong> ${phone}</li>
          </ul>
          ${requests ? `<p><strong>Special Requests:</strong> ${requests}</p>` : ''}
          <p style="margin-top: 20px;">We look forward to serving you! 🍽️</p>
          <p style="text-align: center; font-weight: bold; color: #333;">Thanks for choosing <span style="color: #d63636;">Delicial</span>!</p>
        </div>
      `
    };

    // 💌 Email to Admin
    const adminMail = {
      from: `\"Delicial Bot 🤖\" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: `🍽️ New Reservation from ${name}`,
      html: `
        <div style="font-family: Arial; padding: 20px; background-color: #fff3f3; border: 1px solid #f8caca; border-radius: 10px; max-width: 600px; margin: auto;">
          <h2>📅 New Reservation Details</h2>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Restaurant:</strong> ${restaurant}</li>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
            <li><strong>Guests:</strong> ${guests || 2}</li>
            ${requests ? `<li><strong>Requests:</strong> ${requests}</li>` : ''}
          </ul>
        </div>
      `
    };

    await Promise.all([
      transporter.sendMail(userMail),
      transporter.sendMail(adminMail),
    ]);

    res.status(201).json({
      success: true,
      message: "Reservation created successfully & emails sent!",
      reservation
    });
  } catch (error) {
    console.error('❌ Error creating reservation:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create reservation",
      error: error.message
    });
  }
};

// 📌 Get User's Reservations (User)
export const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ email: req.user.email });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your reservations" });
  }
};