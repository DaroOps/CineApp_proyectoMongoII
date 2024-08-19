// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const paymentSchema = new Schema({
//   ticket_id: {
//     type: Schema.Types.ObjectId,
//     required: true
//   },
//   user_id: {
//     type: Schema.Types.ObjectId,
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   date: {
//     type: Date,
//     required: true
//   },
//   payment_method: {
//     type: String,
//     enum: ['credit_card', 'debit_card', 'cash', 'online_payment'],
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed', 'refunded'],
//     required: true
//   },
//   transaction_reference: String
// });

// const Payment = mongoose.model('Payment', paymentSchema);

// export default Payment; 