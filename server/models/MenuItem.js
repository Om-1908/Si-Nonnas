const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'pizzas', 'panuozzos', 'bites', 'fried', 'salads',
      'dips', 'desserts', 'coffee', 'beer_wine', 'soft_drinks',
      'gelatos', 'sip_italiano', 'prosciutto',
    ],
  },
  imageUrl: { type: String, default: '' },
  isVeg: { type: Boolean, default: false },
  is_available: { type: Boolean, default: true },
  isSignature: { type: Boolean, default: false },
  deleted_at: { type: Date, default: null },
  locationBadge: { type: String, default: null },
}, { timestamps: true });

menuItemSchema.index({ category: 1, is_available: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
