import Reservation from "../models/reservationModel.js";

export const createReservation = async (req, res) => {
  const { name, phone, guests, date, time, specialRequest } = req.body;

  if (!name || !phone || !guests || !date || !time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const reservation = await Reservation.create({
    user: req.user._id,
    name,
    phone,
    guests,
    date,
    time,
    specialRequest,
  });

  res.status(201).json(reservation);
};

export const getMyReservations = async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id });
  res.json(reservations);
};
