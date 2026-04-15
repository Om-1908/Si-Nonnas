import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useOrderStore from '../stores/orderStore';
import api from '../lib/axios';
import socket from '../lib/socket';

const STEPS = ['new', 'preparing', 'ready', 'complete'];
const STEP_LABELS = { new: 'Order received', preparing: 'Preparing your pizza', ready: 'Ready! Come collect', complete: 'Enjoy your meal' };
const STEP_DESC = { new: 'Your order is confirmed and sent to the kitchen.', preparing: 'The dough is being hand-stretched by our artisans.', ready: 'Your items are being plated.', complete: 'The best part of the journey.' };

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { status, setStatus } = useOrderStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(r => { setOrder(r.data); setStatus(r.data.status); }).catch(() => {}).finally(() => setLoading(false));
  }, [orderId, setStatus]);

  useEffect(() => {
    socket.connect();
    socket.emit('join', `order-${orderId}`);
    socket.on('order-status-change', ({ status: s }) => setStatus(s));
    return () => { socket.off('order-status-change'); socket.disconnect(); };
  }, [orderId, setStatus]);

  const currentStep = STEPS.indexOf(status || order?.status || 'new');

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest"><p className="text-muted">Loading...</p></div>;

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Ready banner */}
          {(status || order?.status) === 'ready' && (
            <div className="bg-primary-container/20 border border-primary-container/30 rounded-lg px-6 py-4 mb-8 text-center animate-pulse-amber">
              <p className="text-primary font-heading text-lg font-bold">🔔 Your order is ready!</p>
            </div>
          )}

          <h1 className="font-heading text-3xl font-bold text-on-surface mb-1">#{order?.orderNumber || 'SN-0000'}</h1>
          <p className="text-muted text-sm mb-6">Last updated: just now</p>

          {/* Progress */}
          <div className="space-y-6 mb-6">
            {STEPS.map((step, i) => (
              <div key={step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= currentStep ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-muted'}`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div className={`w-0.5 h-10 mt-1 ${i < currentStep ? 'bg-primary-container' : 'bg-surface-container-highest'}`} />}
                </div>
                <div className="pb-4">
                  <h3 className={`font-medium text-sm ${i <= currentStep ? 'text-on-surface' : 'text-muted'}`}>{STEP_LABELS[step]}</h3>
                  <p className="text-muted/60 text-xs">{STEP_DESC[step]}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order items */}
          {order?.items && (
            <div className="card mb-8">
              <h3 className="text-muted text-xs uppercase tracking-wider mb-3">Order Items</h3>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2">
                  <div>
                    <p className="text-on-surface text-sm">{item.name}</p>
                    <p className="text-muted text-xs">{item.specialNote || ''}</p>
                  </div>
                  <span className="text-muted text-sm">×{item.qty}</span>
                </div>
              ))}
            </div>
          )}

          {(status || order?.status) === 'complete' && (
            <button onClick={() => navigate(`/payment/${orderId}`)} className="btn-primary w-full">Go to payment</button>
          )}
          <Link to="/menu" className="btn-ghost w-full text-center block mt-3">Back to menu</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
