import mongoose from 'mongoose';
const { Schema } = mongoose;

const screeningSchema = new Schema({
    movie_id: { type: Schema.Types.ObjectId, ref: 'Movie' },
    cinema_id: { type: Schema.Types.ObjectId, ref: 'Cinema' },
    theater_id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    date_time: {
      type: Date,
      required: true
    },
    base_price: {
      type: Number,
      required: true,
      min: 0
    },
    available_seats: {
      type: Number,
      required: true,
      min: 0
    },
    occupied_seats: [{
      number: {
        type: Number,
        required: true,
        min: 1
      },
      row: {
        type: String,
        required: true
      }
    }]
  });

const Screening = mongoose.model('Screening', screeningSchema);

export default Screening;
  