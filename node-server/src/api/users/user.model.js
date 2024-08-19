import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['admin', 'standard', 'VIP']
  },
  assignment_date: {
    type: Date,
    required: true
  }
});

const vipCardSchema = new Schema({
  card_number: {
    type: String,
    required: true
  },
  expiration_date: {
    type: Date,
    required: true
  },
  issue_date: {
    type: Date,
    required: true
  }
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: roleSchema,
    required: true
  },
  vip_card: {
    type: vipCardSchema
  },
  purchase_history: [{
    type: Schema.Types.ObjectId
  }]
}, {
  timestamps: true
});


userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'role.type': 1 });
userSchema.index({ 'vip_card.card_number': 1 });
userSchema.index({ 'vip_card.expiration_date': 1 });

const User = model('User', userSchema);

export default User;