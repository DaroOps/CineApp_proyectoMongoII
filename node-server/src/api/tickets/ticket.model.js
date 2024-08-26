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
  screening_time: {
    type: Date,
    required: true
  },
  seat: {
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
  }
});

const Ticket = model('Ticket', ticketSchema, 'tickets');

export default Ticket;