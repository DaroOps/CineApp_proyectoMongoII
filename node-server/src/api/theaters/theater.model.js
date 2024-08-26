import { Schema, model } from 'mongoose';



const seatSchema = new Schema({
  number: {
    type: Number,
    required: true
  },
  row: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['standard', 'vip'],
    required: true
  }
});

const theaterSchema = Schema({
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  seats: [seatSchema]
});

theaterSchema.index({ name: 1 });
theaterSchema.index({ capacity: 1 });
theaterSchema.index({ 'seats.row': 1, 'seats.number': 1 });
theaterSchema.index({ 'seats.type': 1 });

const Theater = model('Theater', theaterSchema);



export default Theater;
