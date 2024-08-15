import mongoose from 'mongoose';
const { Schema } = mongoose;

const discountSchema = new Schema({
    type: {
      type: String,
      required: true
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    conditions: {
      type: String,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    }
  });

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;