const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// POST /api/payments/create-order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const razorpay = getRazorpay();
    const rpOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100), // in paise
      currency: 'INR',
      receipt: order.orderNumber,
    });

    await Payment.create({
      order: order._id,
      razorpayOrderId: rpOrder.id,
      amount: order.total,
      status: 'created',
    });

    res.json({
      razorpay_order_id: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'captured';
    await payment.save();

    // Update order payment status
    await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' });

    res.json({ message: 'Payment verified successfully', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payments — all payments with date filter (manager)
exports.getPayments = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59.999Z');
    }

    const payments = await Payment.find(filter)
      .populate({ path: 'order', select: 'orderNumber total status items orderType tableNumber' })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payments/export — CSV download
exports.exportPayments = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59.999Z');
    }

    const payments = await Payment.find(filter)
      .populate({ path: 'order', select: 'orderNumber' })
      .sort({ createdAt: -1 });

    const header = 'Order,Razorpay Order ID,Razorpay Payment ID,Amount,Currency,Status,Date\n';
    const rows = payments.map(p =>
      `${p.order?.orderNumber || ''},${p.razorpayOrderId},${p.razorpayPaymentId},${p.amount},${p.currency},${p.status},${p.createdAt.toISOString()}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payments.csv');
    res.send(header + rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
