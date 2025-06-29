import Reservation from "../models/reservationModel.js";
import nodemailer from "nodemailer";

export const createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.send("Reservation received!");
    // setup mail transport
    console.log("GMAIL USER:", process.env.EMAIL_USER);
    console.log("GMAIL PASS:", process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // delicial4578@gmail.com
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const userMail = {
      from: `"Delicial" <${process.env.EMAIL_USER}>`,
      to: reservation.email,
      subject: "Your Reservation is Confirmed 🍽️",
      html: `
        <h2>Hey ${reservation.name},</h2>
        <p>Your reservation at <strong>${reservation.restaurant}</strong> is confirmed for:</p>
        <ul>
          <li>Date: ${reservation.date}</li>
          <li>Time: ${reservation.time}</li>
          <li>Guests: ${reservation.guests}</li>
        </ul>
        <p>We can’t wait to serve you! 🍲</p>
      `,
    };

    const adminMail = {
      from: `"Delicial" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: "New Reservation Received",
      html: `
        <h3>New Reservation Details</h3>
        <ul>
          <li>Name: ${reservation.name}</li>
          <li>Email: ${reservation.email}</li>
          <li>Phone: ${reservation.phone}</li>
          <li>Date: ${reservation.date}</li>
          <li>Time: ${reservation.time}</li>
          <li>Guests: ${reservation.guests}</li>
          <li>Restaurant: ${reservation.restaurant}</li>
          <li>Special Requests: ${reservation.requests}</li>
        </ul>
      `,
    };

    await transporter.sendMail(userMail);
    await transporter.sendMail(adminMail);

    res.status(201).json({ message: "Reservation created & emails sent!" });
  } catch (err) {
    console.error("❌ Reservation Error:", err);
    res.status(500).json({ message: "Failed to create reservation" });
  }
};
export const cancelReservation = (req, res) => {
  res.send("Cancel reservation not implemented yet.");
};
