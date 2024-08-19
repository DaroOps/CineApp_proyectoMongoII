// import mongoose from 'mongoose';  
// const { Schema } = mongoose;

// const ticketSchema = new Schema({
//   screening_id: {
//     type: Schema.Types.ObjectId,
//     required: true
//   },
//   user_id: {
//     type: Schema.Types.ObjectId,
//     required: true
//   },
//   seat: {
//     theater_id: {
//       type: Schema.Types.ObjectId,
//       required: true
//     },
//     number: {
//       type: Number,
//       required: true,
//       min: 1
//     },
//     row: {
//       type: String,
//       required: true
//     }
//   },
//   base_price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   discount_applied: {
//     type: {
//       type: String
//     },
//     percentage: {
//       type: Number,
//       min: 0,
//       max: 100
//     }
//   },
//   final_price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   status: {
//     type: String,
//     enum: ['reserved', 'paid', 'cancelled'],
//     required: true
//   },
//   purchase_date: {
//     type: Date,
//     required: true
//   },
//   qr_code: String
// });

// const Ticket = mongoose.model('Ticket', ticketSchema);

// export default Ticket;