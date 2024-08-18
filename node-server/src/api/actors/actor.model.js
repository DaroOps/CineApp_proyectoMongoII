import mongoose from 'mongoose';
const { Schema } = mongoose;

const actorSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  image_url: {
    type: String
  },
});

actorSchema.index({ name: 1 });

const Actor = mongoose.model('Actor', actorSchema, 'actors');
// console.log('Modelos registrados:', mongoose.modelNames());
export default Actor;