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

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(r => setOrder(r.data)).catch(() => {});
  }, [orderId]);

  const handleReview = async () => {
    try {
      await api.post('/reviews', { orderId, rating: review.rating, comment: review.comment });
      setReviewSubmitted(true);
      showToast('Thanks for your feedback!', 'success');
    } catch {
      showToast('Failed to submit review', 'error');
    }
  };

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0a02]">
      <p className="text-[#a0815a]">Loading receipt...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#1a0a02]">
      <Navbar />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-lg mx-auto">

          {/* Success header */}
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-5xl text-[#FF9E18] mb-3 block">check_circle</span>
            <h1 className="font-heading text-3xl font-bold text-[#ffdbc7] mb-1">Payment Confirmed</h1>
            <p className="text-[#a0815a] text-sm">Order {order.orderNumber}</p>
          </div>

          {/* Full bill summary */}
          <div className="bg-[#2e1b0e] rounded-[4px] p-5 mb-6">
            <div className="flex justify-between mb-4">
              <span className="text-[#a0815a] text-[10px] uppercase tracking-wider">Receipt</span>
              <span className="text-[#a0815a] text-xs">
                {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-[#463022] last:border-0">
                <div>
                  <span className="text-[#ffdbc7] text-sm">{item.name}</span>
                  <span className="text-[#a0815a] text-xs ml-2">× {item.qty}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#a0815a] text-xs block">₹{item.price} each</span>
                  <span className="text-[#ffdbc7] text-sm font-semibold">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-[#463022] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#a0815a]">Subtotal</span>
                <span className="text-[#ffdbc7]">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#a0815a]">GST (5%)</span>
                <span className="text-[#ffdbc7]">₹{order.tax}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#463022]">
                <span className="font-semibold text-[#ffdbc7]">Total paid</span>
                <span className="font-heading text-2xl font-bold text-[#FF9E18]">₹{order.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Review UI — always visible inline, no button to reveal */}
          <div className="bg-[#2e1b0e] rounded-[4px] p-5 mb-6">
            {reviewSubmitted ? (
              <p className="text-[#FF9E18] text-center font-heading font-semibold">
                Thank you for your feedback! 🎉
              </p>
            ) : (
              <>
                <h3 className="font-heading text-[#ffdbc7] font-semibold mb-4">Rate your experience</h3>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setReview({ ...review, rating: n })}
                      className={`text-3xl transition-colors ${n <= review.rating ? 'text-[#FF9E18]' : 'text-[#a0815a]'}`}
                    >★</button>
                  ))}
                </div>
                <textarea
                  value={review.comment}
                  onChange={e => setReview({ ...review, comment: e.target.value })}
                  className="w-full bg-[#3a2518] text-[#ffdbc7] border border-[#463022] rounded-[2px] px-4 py-3 mb-4 h-24 resize-none focus:outline-none focus:border-[#FF9E18] placeholder:text-[#544434] text-sm"
                  placeholder="Tell us about your experience..."
                />
                <button
                  onClick={handleReview}
                  disabled={review.rating === 0}
                  className="w-full bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.1em] py-3 rounded-[2px] hover:bg-[#ffb84d] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-3">
            <Link to="/"
              className="flex-1 border border-[#a0815a] text-[#ffdbc7] uppercase tracking-[0.08em] py-3 rounded-[2px] text-center text-xs font-semibold hover:border-[#ffdbc7] transition-colors">
              Back to Home
            </Link>
            <Link to="/menu"
              className="flex-1 bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.08em] py-3 rounded-[2px] text-center text-xs hover:bg-[#ffb84d] transition-colors">
              Order Again
            </Link>
          </div>
          <button
            onClick={() => window.print()}
            className="w-full border border-[#2e1b0e] text-[#a0815a] py-2.5 rounded-[2px] text-xs hover:text-[#ffdbc7] transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download Receipt
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
