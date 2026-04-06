const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  specialNote: { type: String, default: '' },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: String,
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  tableNumber: { type: String, default: null },
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway'],
    default: 'dine-in',   // fixed: was 'takeaway'
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['new', 'preparing', 'ready', 'complete', 'cancelled'],
    default: 'new',
  },
  statusHistory: [statusHistorySchema],
  paymentStatus: {
    type: String,
    enum: ['pending', 'cash-pending', 'cash-confirmed', 'paid', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'cash', null],
    default: null,
  },
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `SN-${String(count + 1001).padStart(4, '0')}`;
  }
  next();
});

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
