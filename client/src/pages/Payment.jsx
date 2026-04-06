import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { showToast } from '../components/Toast';
import QRCodeImage from './QRCODE.jpeg';

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [confirming, setConfirming] = useState(false);
  // Cash payment flow state
  const [cashPending, setCashPending] = useState(false);
  const [cashCancelling, setCashCancelling] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then(r => setOrder(r.data))
      .catch(() => showToast('Failed to load order', 'error'));
  }, [orderId]);

  // Cleanup polling on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const handlePaymentDone = async () => {
    setConfirming(true);
    try {
      await api.patch(`/orders/${orderId}/payment-status`, { paymentStatus: 'paid', paymentMethod: 'upi' });
      setShowQR(false);
      navigate(`/receipt/${orderId}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to confirm payment', 'error');
    } finally {
      setConfirming(false);
    }
  };

  const handleRequestCash = async () => {
    try {
      await api.patch(`/orders/${orderId}/payment-status`, { paymentStatus: 'cash-pending', paymentMethod: 'cash' });
      setCashPending(true);
      // Poll every 5s for cash-confirmed
      pollRef.current = setInterval(async () => {
        try {
          const { data } = await api.get(`/orders/${orderId}`);
          if (data.paymentStatus === 'cash-confirmed') {
            clearInterval(pollRef.current);
            navigate(`/receipt/${orderId}`);
          }
        } catch { /* ignore */ }
      }, 5000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to request cash payment', 'error');
    }
  };

  const handleCancelCash = async () => {
    setCashCancelling(true);
    try {
      clearInterval(pollRef.current);
      await api.patch(`/orders/${orderId}/payment-status`, { paymentStatus: 'pending' });
      setCashPending(false);
    } catch {
      showToast('Failed to cancel cash request', 'error');
    } finally {
      setCashCancelling(false);
    }
  };

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0a02]">
      <p className="text-[#a0815a]">Loading order...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#1a0a02]">
      <Navbar />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-lg mx-auto">
          <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-2">Checkout</p>
          <h1 className="font-heading text-3xl font-bold text-[#ffdbc7] mb-1">Time to settle up</h1>
          <p className="text-[#a0815a] text-sm mb-8">Order {order.orderNumber}</p>

          {/* Order Summary Card */}
          <div className="bg-[#2e1b0e] rounded-[4px] p-5 mb-6">
            <h3 className="text-[#a0815a] text-[10px] uppercase tracking-wider mb-4">Order Summary</h3>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-[#463022] last:border-0">
                <span className="text-[#ffdbc7] text-sm">{item.name} × {item.qty}</span>
                <span className="text-[#ffdbc7] text-sm">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
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
                <span className="font-semibold text-[#ffdbc7]">Total</span>
                <span className="font-heading text-2xl font-bold text-[#FF9E18]">₹{order.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Cash pending confirmation screen */}
          {cashPending ? (
            <div className="bg-[#2e1b0e] rounded-[4px] p-6 text-center">
              <span className="material-symbols-outlined text-4xl text-green-400 block mb-3">check_circle</span>
              <h2 className="font-heading text-xl font-bold text-[#ffdbc7] mb-2">Cash payment requested!</h2>
              <p className="text-[#a0815a] text-sm mb-3 leading-relaxed">
                Please pay <span className="text-[#FF9E18] font-bold">₹{order.total?.toLocaleString('en-IN')}</span> at the counter.<br />
                Staff will confirm your payment.
              </p>
              <p className="text-[#544434] text-xs mb-5">Order {order.orderNumber}</p>
              <div className="flex items-center justify-center gap-2 text-[#a0815a] text-xs mb-5">
                <span className="w-2 h-2 rounded-full bg-[#FF9E18] animate-pulse" />
                Waiting for staff confirmation...
              </div>
              <button
                onClick={handleCancelCash}
                disabled={cashCancelling}
                className="border border-[#544434] text-[#a0815a] text-xs uppercase tracking-wider px-6 py-2 rounded-[2px] hover:border-[#a0815a] hover:text-[#ffdbc7] transition-colors disabled:opacity-50"
              >
                {cashCancelling ? 'Cancelling...' : 'Cancel request'}
              </button>
            </div>
          ) : (
            /* Two payment option cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1 — QR / UPI */}
              <div style={{ background: '#1f0d04', border: '1px solid rgba(239,159,39,0.45)', borderRadius: '10px', padding: '1.25rem' }}
                className="flex flex-col items-center text-center">
                <span className="text-3xl mb-3">📲</span>
                <p className="text-[#ffdbc7] font-semibold mb-1" style={{ fontSize: '15px' }}>Pay by UPI / QR</p>
                <p className="text-[#a0815a] mb-4" style={{ fontSize: '12px' }}>Scan QR code at counter</p>
                <button
                  onClick={() => setShowQR(true)}
                  className="w-full bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.08em] py-2.5 rounded-[2px] hover:bg-[#ffb84d] transition-colors text-xs"
                >
                  Scan QR to Pay
                </button>
              </div>

              {/* Card 2 — Cash */}
              <div style={{ background: '#1f0d04', border: '1px solid rgba(160,129,90,0.3)', borderRadius: '10px', padding: '1.25rem' }}
                className="flex flex-col items-center text-center">
                <span className="text-3xl mb-3">💵</span>
                <p className="text-[#ffdbc7] font-semibold mb-1" style={{ fontSize: '15px' }}>Pay by Cash</p>
                <p className="text-[#a0815a] mb-4" style={{ fontSize: '12px' }}>Pay at the counter, staff will confirm</p>
                <button
                  onClick={handleRequestCash}
                  className="w-full border border-[#a0815a] text-[#ffdbc7] uppercase tracking-[0.08em] py-2.5 rounded-[2px] hover:border-[#ffdbc7] transition-colors text-xs font-semibold"
                >
                  Request Cash Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* QR Code Modal Overlay */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowQR(false); }}
        >
          <div
            className="relative flex flex-col items-center"
            style={{
              background: '#1f0d04',
              border: '1px solid rgba(239,159,39,0.3)',
              borderRadius: '12px',
              maxWidth: '420px',
              width: '90%',
              padding: '2rem',
            }}
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-3 right-4 text-[#a0815a] hover:text-[#ffdbc7] text-xl leading-none"
            >×</button>

            <h2 className="font-heading text-2xl font-bold text-[#ffdbc7] text-center mb-2">Scan to Pay</h2>
            <p className="text-[#FF9E18] text-3xl font-heading font-bold text-center mb-4">
              ₹{order.total?.toLocaleString('en-IN')}
            </p>

            {/* Local QR image */}
            <img
              src={QRCodeImage}
              alt="Payment QR Code"
              style={{ width: '100%', maxWidth: '280px', borderRadius: '8px', display: 'block', margin: '1rem auto' }}
            />

            <p className="text-[#a0815a] text-center mb-6" style={{ fontSize: '13px' }}>
              Show this screen to staff after payment
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={handlePaymentDone}
                disabled={confirming}
                className="flex-1 bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.08em] py-3 rounded-[2px] hover:bg-[#ffb84d] transition-colors text-xs disabled:opacity-50"
              >
                {confirming ? 'Confirming...' : 'Payment Done'}
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="flex-1 border border-[#a0815a] text-[#ffdbc7] uppercase tracking-[0.08em] py-3 rounded-[2px] hover:border-[#ffdbc7] transition-colors text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
