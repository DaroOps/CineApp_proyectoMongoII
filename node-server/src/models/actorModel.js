import { Schema, model } from 'mongoose';

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

const Actor = model('Actor', actorSchema);

export default Actor;