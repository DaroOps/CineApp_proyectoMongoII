import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
  screening_id: {
    type: Schema.Types.ObjectId,
    ref: 'Screening',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seat: {
    theater_id: {
      type: Schema.Types.ObjectId,
      ref: 'Theater',
      required: true
    },
    number: {
      type: Number,
      required: true,
      min: 1
    },
    row: {
      type: String,
      required: true
    }
  },
  base_price: {
    type: Number,
    required: true,
    min: 0
  },
  discount_applied: {
    type: {
      type: String
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  final_price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['reserved', 'paid', 'cancelled'],
    required: true
  },
  purchase_date: {
    type: Date,
    required: true
  },
  qr_code: String
});

const Ticket = model('Ticket', ticketSchema, 'tickets');

export default Ticket;