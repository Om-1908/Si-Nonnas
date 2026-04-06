const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  reply: { type: String, default: '' },
  repliedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
