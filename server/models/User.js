const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  country: { type: String },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
});

module.exports = mongoose.model('User', userSchema);
