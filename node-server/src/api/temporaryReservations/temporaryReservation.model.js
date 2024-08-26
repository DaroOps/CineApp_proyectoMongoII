import mongoose from 'mongoose';

const temporaryReservationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    screening_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Screening', required: true },
    seats: [{ row: String, number: Number }],
    expiration_time: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'expired', 'cancelled'], default: 'pending' }
  });
  
const TemporaryReservation = mongoose.model('TemporaryReservation', temporaryReservationSchema, 'temporary_reservations');

export default TemporaryReservation;