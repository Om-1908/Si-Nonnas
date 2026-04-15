import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useCartStore from '../stores/cartStore';
import useOrderStore from '../stores/orderStore';
import api from '../lib/axios';
import { showToast } from '../components/Toast';

export default function OrderReview() {
  const { items, orderType, tableNumber, setOrderType, setTableNumber, updateQty, removeItem, clearCart } = useCartStore();
  const { setActiveOrder } = useOrderStore();
  const navigate = useNavigate();
  const [tableError, setTableError] = useState('');

  useEffect(() => { if (items.length === 0) navigate('/menu'); }, [items.length, navigate]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + tax;

  const handleProceed = async () => {
    if (!tableNumber || String(tableNumber).trim() === '') {
      setTableError('Please enter your table number');
      return;
    }
    setTableError('');
    try {
      const orderItems = items.map(i => ({ menuItem: i._id, name: i.name, price: i.price, qty: i.qty }));
      const { data } = await api.post('/orders', { items: orderItems, tableNumber, orderType });
      setActiveOrder(data.orderId);
      clearCart();
      navigate(`/payment/${data.orderId}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading text-3xl font-bold text-on-surface mb-2">Review Your Order</h1>
          <p className="text-muted text-sm mb-8">Double-check before we fire the oven.</p>

          {/* Order Type Toggle */}
          <div className="flex gap-2 mb-6">
            {['dine-in', 'takeaway'].map(t => (
              <button key={t} onClick={() => setOrderType(t)}
                className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-all ${orderType === t ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-muted hover:text-on-surface'}`}>
                {t === 'dine-in' ? 'Dine-in' : 'Takeaway'}
              </button>
            ))}
          </div>

          {/* Table Number */}
          <div className="mb-8">
            <label className="block text-[#a0815a] text-[10px] uppercase tracking-widest font-semibold mb-2">
              Table Number
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={tableNumber || ''}
              onChange={e => { setTableNumber(e.target.value); setTableError(''); }}
              placeholder="Enter your table number"
              className="w-full rounded-lg p-3 text-sm bg-[#1a0a02] text-[#f5e6c8] placeholder:text-[#614b38] outline-none"
              style={{ border: '1px solid rgba(255,158,24,0.3)' }}
            />
            {tableError && (
              <p className="text-red-400 text-xs mt-1.5">{tableError}</p>
            )}
          </div>

          {/* Items */}
          <div className="space-y-3 mb-8">
            {items.map(item => (
              <div key={item._id} className="card flex items-center gap-4">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h3 className="text-on-surface text-sm font-medium truncate">{item.name}</h3>
                  <p className="text-primary text-sm">₹{item.price} × {item.qty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 rounded-sm bg-surface-container-highest text-on-surface flex items-center justify-center text-sm">−</button>
                  <span className="text-on-surface text-sm font-medium w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 rounded-sm bg-surface-container-highest text-on-surface flex items-center justify-center text-sm">+</button>
                  <button onClick={() => removeItem(item._id)} className="ml-2 text-muted hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="card space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span className="text-on-surface">₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">GST (5%)</span><span className="text-on-surface">₹{tax.toLocaleString('en-IN')}</span></div>
            <div className="border-t border-outline-variant/10 pt-3 flex justify-between"><span className="text-on-surface font-semibold">Total</span><span className="text-primary font-heading text-xl font-bold">₹{total.toLocaleString('en-IN')}</span></div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => navigate(-1)} className="btn-secondary flex-1">Edit order</button>
            <button onClick={handleProceed} className="btn-primary flex-1">Proceed to payment</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
