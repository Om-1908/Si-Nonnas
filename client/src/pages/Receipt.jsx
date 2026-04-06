import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { showToast } from '../components/Toast';

export default function Receipt() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(r => setOrder(r.data)).catch(() => {});
  }, [orderId]);

  const handleReview = async () => {
    try {
      await api.post('/reviews', { orderId, rating: review.rating, comment: review.comment });
      setReviewSubmitted(true);
      showToast('Thanks for your feedback!', 'success');
    } catch (err) {
      showToast('Failed to submit review', 'error');
    }
  };

  if (!order) return <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest"><p className="text-muted">Loading...</p></div>;

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-lg mx-auto text-center">
          <span className="material-symbols-outlined text-6xl text-primary-container mb-4 block">check_circle</span>
          <h1 className="font-heading text-3xl font-bold text-on-surface mb-1">Payment Confirmed</h1>
          <p className="text-muted mb-8">Order {order.orderNumber}</p>

          <div className="card text-left mb-6">
            <div className="flex justify-between mb-4">
              <span className="text-muted text-xs uppercase tracking-wider">Receipt</span>
              <span className="text-muted text-xs">{new Date(order.createdAt).toLocaleString('en-IN')}</span>
            </div>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-outline-variant/5 last:border-0">
                <span className="text-on-surface text-sm">{item.name} × {item.qty}</span>
                <span className="text-on-surface text-sm">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-outline-variant/10 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">GST</span><span>₹{order.tax}</span></div>
              <div className="flex justify-between font-semibold text-on-surface"><span>Total paid</span><span className="text-primary">₹{order.total}</span></div>
            </div>
          </div>

          {/* Review */}
          {reviewSubmitted ? (
            <p className="text-primary text-sm mb-6">Thanks for your feedback! 🎉</p>
          ) : showReviewForm ? (
            <div className="card text-left mb-6 animate-fade-in">
              <h3 className="font-heading font-semibold text-on-surface mb-3">Rate your experience</h3>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setReview({ ...review, rating: n })}
                    className={`text-2xl transition-colors ${n <= review.rating ? 'text-primary-container' : 'text-muted/30'}`}>★</button>
                ))}
              </div>
              <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} className="input-field mb-3 h-24 resize-none" placeholder="Tell us about your experience..." />
              <button onClick={handleReview} disabled={review.rating === 0} className="btn-primary w-full disabled:opacity-50">Submit review</button>
            </div>
          ) : (
            <button onClick={() => setShowReviewForm(true)} className="btn-secondary mb-6">Rate your experience</button>
          )}

          <div className="flex gap-3">
            <Link to="/" className="btn-secondary flex-1">Back to home</Link>
            <Link to="/menu" className="btn-primary flex-1">Order again</Link>
          </div>
          <button onClick={() => window.print()} className="btn-ghost w-full mt-3 text-sm">
            <span className="material-symbols-outlined text-sm align-middle mr-1">download</span>Download receipt
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
