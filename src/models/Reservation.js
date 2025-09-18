import mongoose from 'mongoose';
const reservationSchema = new mongoose.Schema({
  catwayId: { type: mongoose.Schema.Types.ObjectId, ref: 'Catway', required: true },
  catwayNumber: { type: Number, required: true },
  clientName: { type: String, required: true },
  boatName: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true }
}, { timestamps: true });
export default mongoose.model('Reservation', reservationSchema);
