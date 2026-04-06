import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { showToast } from '../components/Toast';

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(r => setOrder(r.data)).catch(() => showToast('Failed to load order', 'error'));
  }, [orderId]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/payments/create-order', { orderId });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "Si Nonna's",
        description: `Order ${order?.orderNumber}`,
        order_id: data.razorpay_order_id,
        theme: { color: '#FF9E18' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate(`/receipt/${orderId}`);
          } catch {
            showToast('Payment verification failed', 'error');
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        showToast('Payment failed, please try again', 'error');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create payment', 'error');
      setLoading(false);
    }
  };

  if (!order) return <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest"><p className="text-muted">Loading...</p></div>;

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-lg mx-auto">
          <h1 className="font-heading text-3xl font-bold text-on-surface mb-1">Time to settle up</h1>
          <p className="text-muted text-sm mb-8">Order {order.orderNumber}</p>

          <div className="card mb-6">
            <h3 className="text-muted text-xs uppercase tracking-wider mb-4">Order Summary</h3>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-outline-variant/5 last:border-0">
                <span className="text-on-surface text-sm">{item.name} × {item.qty}</span>
                <span className="text-on-surface text-sm">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-outline-variant/10 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">GST (5%)</span><span>₹{order.tax}</span></div>
              <div className="flex justify-between pt-2 border-t border-outline-variant/10">
                <span className="font-semibold text-on-surface">Total</span>
                <span className="font-heading text-2xl font-bold text-primary">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <button onClick={handlePay} disabled={loading} className="btn-primary w-full text-lg py-4 disabled:opacity-50">
            {loading ? 'Processing...' : `Pay ₹${order.total.toLocaleString('en-IN')}`}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
