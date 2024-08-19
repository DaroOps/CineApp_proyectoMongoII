// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const userSchema = new Schema({
//     name: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true,
//       match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
//     },
//     password: {
//       type: String,
//       required: true
//     },
//     role: {
//       type: {
//         type: String,
//         enum: ['admin', 'standard', 'VIP'],
//         required: true
//       },
//       assignment_date: {
//         type: Date,
//         required: true
//       }
//     },
//     vip_card: {
//       card_number: String,
//       expiration_date: Date,
//       issue_date: Date
//     },
//     purchase_history: [{
//       type: Schema.Types.ObjectId
//     }]
//   });

// const User = mongoose.model('User', userSchema);

// export default User;