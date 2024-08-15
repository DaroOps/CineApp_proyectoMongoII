import mongoose from 'mongoose';
const { Schema } = mongoose;

const theaterSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    seats: [{
      number: {
        type: Number,
        required: true,
        min: 1
      },
      row: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['standard', 'VIP'],
        required: true
      }
    }]
  });

const Theater = mongoose.model('Theater', theaterSchema);

export default Theater;