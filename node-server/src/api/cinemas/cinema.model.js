import mongoose from 'mongoose';
const { Schema } = mongoose;

const cinemaSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  }
});

const Cinema = mongoose.model('Cinema', cinemaSchema, 'cinemas');

export default Cinema;