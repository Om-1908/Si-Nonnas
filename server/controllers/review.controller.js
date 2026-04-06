const Review = require('../models/Review');

// POST /api/reviews — create review
exports.createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    const review = await Review.create({
      order: orderId || null,
      user: req.user ? req.user._id : null,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews — all reviews with rating filter (manager)
exports.getReviews = async (req, res) => {
  try {
    const { rating } = req.query;
    const filter = {};
    if (rating) filter.rating = parseInt(rating);

    const reviews = await Review.find(filter)
      .populate('user', 'name email')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/reviews/:id/reply — manager reply
exports.replyToReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { reply: req.body.message, repliedAt: new Date() },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
