import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
    type: String,
    name: String,
    value: Number,
    isPercentage: Boolean
  });
  
const Discount = mongoose.model('Discount', discountSchema);

export default Discount;