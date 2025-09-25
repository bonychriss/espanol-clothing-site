const mongoose = require('mongoose');

const BestPickSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String, required: true }, // url or path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BestPick', BestPickSchema);
