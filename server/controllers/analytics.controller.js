const Order = require('../models/Order');

// GET /api/analytics/summary
exports.getSummary = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({ createdAt: { $gte: todayStart } });
    const activeOrders = await Order.countDocuments({ status: { $in: ['new', 'preparing', 'ready'] } });
    const completedToday = todayOrders.filter(o => o.status === 'complete' || o.paymentStatus === 'paid');
    const todayRevenue = completedToday.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = completedToday.length > 0 ? todayRevenue / completedToday.length : 0;

    res.json({
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      activeOrders,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      totalOrdersToday: todayOrders.length,
      completedToday: completedToday.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analytics/revenue — daily revenue for a range
exports.getRevenue = async (req, res) => {
  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = to ? new Date(to + 'T23:59:59.999Z') : new Date();

    const data = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data.map(d => ({ date: d._id, revenue: d.revenue, orders: d.orders })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analytics/top-items — top 10 items
exports.getTopItems = async (req, res) => {
  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = to ? new Date(to + 'T23:59:59.999Z') : new Date();

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalQty: { $sum: '$items.qty' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 10 },
    ]);

    res.json(data.map(d => ({ name: d._id, qty: d.totalQty, revenue: d.totalRevenue })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analytics/orders-by-hour
exports.getOrdersByHour = async (req, res) => {
  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = to ? new Date(to + 'T23:59:59.999Z') : new Date();

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill all 24 hours
    const result = Array.from({ length: 24 }, (_, i) => {
      const found = data.find(d => d._id === i);
      return { hour: `${i}:00`, count: found ? found.count : 0 };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
