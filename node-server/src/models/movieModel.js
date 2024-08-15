import mongoose from 'mongoose';
const { Schema } = mongoose;

const movieSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    genre: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    synopsis: {
      type: String,
      required: true
    },
    screening_times: [Date],
    image_url: {
      type: String,
      required: true
    }
  });

const Movie = mongoose.model('Movie', movieSchema, 'movies');

export default Movie;