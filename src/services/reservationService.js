import Reservation from '../models/Reservation.js';
export const listReservationsForCatway = (catwayId) => Reservation.find({ catwayId });
export const getReservation = (id) => Reservation.findById(id);
export const createReservation = (data) => Reservation.create(data);
export const removeReservation = (id) => Reservation.findByIdAndDelete(id);
export const listAllReservations = () => Reservation.find().sort({ checkIn: -1 });
