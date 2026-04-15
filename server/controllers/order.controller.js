const Order = require('../models/Order');

// POST /api/orders — create order
exports.createOrder = async (req, res) => {
  try {
    const { items, tableNumber, orderType } = req.body;
    console.log('Order created with type:', orderType, 'table:', tableNumber);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const order = await Order.create({
      user: req.user ? req.user._id : null,
      tableNumber,
      orderType: orderType || 'dine-in',
      items,
      subtotal,
      tax,
      total,
      status: 'new',
      statusHistory: [{ status: 'new', changedAt: new Date() }],
    });

    // Emit to kitchen
    const io = req.app.get('io');
    if (io) {
      const populated = await Order.findById(order._id).populate('user', 'name email');
      io.to('kitchen').emit('new-order', populated);
    }

    res.status(201).json({ orderId: order._id, orderNumber: order.orderNumber, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders — all orders with filters (manager). Default: last 30 days, newest first.
exports.getOrders = async (req, res) => {
  try {
    const { status, paymentStatus, from, to, limit = 50, sort = 'recent' } = req.query;
    const filter = {};

    if (status) {
      filter.status = { $in: status.split(',') };
    }

    if (paymentStatus) {
      filter.paymentStatus = { $in: paymentStatus.split(',') };
    }

    // Date filter — default to last 30 days if no params given
    const now = new Date();
    const defaultFrom = new Date(now);
    defaultFrom.setDate(defaultFrom.getDate() - 30);

    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    else filter.createdAt.$gte = defaultFrom;
    if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59.999Z');

    const sortObj = sort === 'recent' ? { createdAt: -1 } : { createdAt: 1 };

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort(sortObj)
      .limit(parseInt(limit));

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/my — current user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/export — CSV download
exports.exportOrders = async (req, res) => {
  try {
    const { status, from, to } = req.query;
    const filter = {};
    if (status) filter.status = { $in: status.split(',') };
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59.999Z');
    }

    const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });

    const header = 'Order Number,Customer,Type,Status,Items,Subtotal,Tax,Total,Date\n';
    const rows = orders.map(o =>
      `${o.orderNumber},${o.user?.name || 'Guest'},${o.orderType},${o.status},"${o.items.map(i => `${i.name} x${i.qty}`).join('; ')}",${o.subtotal},${o.tax},${o.total},${o.createdAt.toISOString()}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    res.send(header + rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id — single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.menuItem', 'imageUrl');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/orders/:id/status — update status (kitchen_staff + manager)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, changedAt: new Date() });
    await order.save();

    const io = req.app.get('io');
    if (io) {
      const room = `order-${order._id}`;
      io.to(room).emit('order-status-change', { orderId: order._id, status });

      if (status === 'ready') {
        io.to(room).emit('order-ready', { orderId: order._id });
      }
      if (status === 'complete') {
        io.to(room).emit('order-complete', { orderId: order._id });
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/orders/:id/payment-status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    const update = { paymentStatus };
    if (paymentMethod) update.paymentMethod = paymentMethod;

    // If payment was cancelled, also cancel the order itself
    if (paymentStatus === 'payment-cancelled') {
      update.status = 'cancelled';
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const io = req.app.get('io');
    if (io) {
      if (paymentStatus === 'cash-confirmed') {
        io.to(`order-${req.params.id}`).emit('payment-cash-confirmed', { orderId: req.params.id });
      }
      if (paymentStatus === 'upi-confirmed') {
        io.to(`order-${req.params.id}`).emit('payment-upi-confirmed', { orderId: req.params.id });
      }
      if (paymentStatus === 'payment-cancelled') {
        io.emit('order-cancelled', { orderId: req.params.id });
      }
      // Notify manager payment dashboard
      if (paymentStatus === 'paid' || paymentStatus === 'cash-confirmed' || paymentStatus === 'upi-confirmed') {
        io.emit('payment-captured', {
          _id: order._id,
          amount: order.total,
          order: { _id: order._id, orderNumber: order.orderNumber, orderType: order.orderType, tableNumber: order.tableNumber },
          status: paymentStatus,
          createdAt: new Date(),
        });
      }
    }

    res.json({ message: 'Payment status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
