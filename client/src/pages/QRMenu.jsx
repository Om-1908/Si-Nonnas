import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useCartStore from '../stores/cartStore';
import useOrderStore from '../stores/orderStore';
import api from '../lib/axios';
import socket from '../lib/socket';
import { showToast } from '../components/Toast';
import { mockMenuItems, CATEGORY_LABELS } from '../lib/mockData';

export default function QRMenu() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { items: cartItems, addItem, updateQty, setTableNumber, setOrderType, clearCart } = useCartStore();
  const { setActiveOrder } = useOrderStore();
  const [unavailable, setUnavailable] = useState(new Set());
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setTableNumber(tableId);
    setOrderType('dine-in');
  }, [tableId, setTableNumber, setOrderType]);

  const { data: items = [] } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => { const { data } = await api.get('/menu'); return data; },
    placeholderData: mockMenuItems,
  });

  useEffect(() => {
    socket.connect();
    socket.emit('join', 'kitchen');
    socket.on('item-unavailable', (itemId) => setUnavailable(prev => new Set([...prev, itemId])));
    return () => { socket.off('item-unavailable'); socket.disconnect(); };
  }, []);

  const categories = [...new Set(items.map(i => i.category))];
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);

  const handleSendToKitchen = async () => {
    if (cartItems.length === 0) return;
    setSending(true);
    try {
      const orderItems = cartItems.map(i => ({ menuItem: i._id, name: i.name, price: i.price, qty: i.qty }));
      const { data } = await api.post('/orders', { items: orderItems, tableNumber: tableId, orderType: 'dine-in' });
      setActiveOrder(data.orderId);
      clearCart();
      navigate(`/order/tracking/${data.orderId}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setSending(false);
    }
  };

  const getCartQty = (id) => cartItems.find(i => i._id === id)?.qty || 0;

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      {/* Header */}
      <header className="bg-surface-container border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold text-primary-container">Si Nonna's</h1>
            <p className="text-muted text-sm">Table {tableId} · Dine-in</p>
          </div>
          {totalItems > 0 && (
            <div className="bg-primary-container/15 rounded-lg px-4 py-2 text-center">
              <p className="text-primary text-xs">{totalItems} items</p>
              <p className="text-on-surface font-semibold text-sm">₹{subtotal}</p>
            </div>
          )}
        </div>
      </header>

      {/* Menu */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-3xl mx-auto px-6 py-6">
          {categories.map(cat => (
            <section key={cat} className="mb-10">
              <h2 className="font-heading text-lg font-bold text-on-surface mb-4">{CATEGORY_LABELS[cat] || cat}</h2>
              <div className="space-y-3">
                {items.filter(i => i.category === cat).map(item => {
                  const isOOS = !item.is_available || unavailable.has(item._id);
                  const qty = getCartQty(item._id);
                  return (
                    <div key={item._id} className={`card flex gap-4 ${isOOS ? 'opacity-40 grayscale' : ''}`}>
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={item.isVeg ? 'badge-veg' : 'badge-nonveg'} />
                          <h3 className="text-on-surface text-sm font-medium truncate">{item.name}</h3>
                        </div>
                        <p className="text-muted text-xs line-clamp-1">{item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-primary font-semibold text-sm">₹{item.price}</span>
                          {isOOS ? (
                            <span className="text-error text-xs">Unavailable</span>
                          ) : qty > 0 ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateQty(item._id, qty - 1)} className="w-6 h-6 rounded-sm bg-surface-container-highest text-on-surface flex items-center justify-center text-xs">−</button>
                              <span className="text-on-surface text-sm font-medium w-4 text-center">{qty}</span>
                              <button onClick={() => updateQty(item._id, qty + 1)} className="w-6 h-6 rounded-sm bg-surface-container-highest text-on-surface flex items-center justify-center text-xs">+</button>
                            </div>
                          ) : (
                            <button onClick={() => addItem(item)} className="text-xs font-semibold px-3 py-1 rounded-sm bg-primary-container/15 text-primary hover:bg-primary-container/25 transition-colors">Add +</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Bottom CTA */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface-container border-t border-outline-variant/10 px-6 py-4 z-50">
          <div className="max-w-3xl mx-auto">
            <button onClick={handleSendToKitchen} disabled={sending} className="btn-primary w-full text-center flex items-center justify-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined text-xl">send</span>
              {sending ? 'Sending...' : `Send to kitchen · ₹${subtotal}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
