import mongoose from 'mongoose';
const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true, unique: true },
  type: { type: String, enum: ['long','short'], required: true },
  catwayState: { type: String, default: 'ok' }
}, { timestamps: true });
export default mongoose.model('Catway', catwaySchema);
