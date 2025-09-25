const mongoose = require('mongoose');

const FeaturedImageSchema = new mongoose.Schema({
  image: { type: String, required: true }, // base64 or url
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeaturedImage', FeaturedImageSchema);
