import { Schema, model } from 'mongoose';

const screeningSchema = new Schema({
  movie_id: { type: Schema.Types.ObjectId, ref: 'Movie' },
  cinema_id: { type: Schema.Types.ObjectId, ref: 'Cinema' },
  theater_id: { type: Schema.Types.ObjectId, ref: 'Theater' },
  date_time: { 
    type: Date, 
    required: true 
  },
  base_price: {
    type: Number,
    required: true
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
    },
    _id: false
  }],
  type: { 
    type: String, 
    enum: ['2D', '3D'], 
    required: false,
    validate: {
      validator: async function(value) {
        if (value === '3D') {
          const Theater = model('Theater');
          const theater = await Theater.findById(this.theater_id);
          return theater && (theater.name.includes('NEO') || theater.name.includes('Pro'));
        }
        return true;
      },
      message: 'For 3D screenings, the theater must be named "NEO" or "Pro".'
    }
  }
});

screeningSchema.index({ theater_id: 1, date_time: 1 });
screeningSchema.index({ movie_id: 1 });
screeningSchema.index({ type: 1 });

const Screening = model('Screening', screeningSchema);

export default Screening;