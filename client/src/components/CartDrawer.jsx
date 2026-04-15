import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, updateQty, removeItem, tableNumber, setTableNumber } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const [tableError, setTableError] = useState('');

  const handleViewCart = () => {
    if (!tableNumber || String(tableNumber).trim() === '') {
      setTableError('Please enter your table number');
      return;
    }
    setTableError('');
    closeDrawer();
    if (!user) {
      navigate('/login?redirect=/order/review');
    } else {
      navigate('/order/review');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[60] animate-fade-in" onClick={closeDrawer} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-[70] bg-surface-container border-l border-outline-variant/10 flex flex-col animate-slide-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
          <h2 className="font-heading text-lg font-bold text-on-surface">Your Basket</h2>
          <button onClick={closeDrawer} className="text-muted hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-muted/40 mb-3 block">shopping_bag</span>
              <p className="text-muted text-sm">Your basket is waiting...</p>
              <p className="text-muted/60 text-xs mt-1">Add some artisanal magic to get started.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex gap-4 bg-surface-container-high rounded-lg p-3">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-on-surface text-sm font-medium truncate">{item.name}</h3>
                    <button onClick={() => removeItem(item._id)} className="text-muted hover:text-error transition-colors flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                  <p className="text-primary text-sm font-semibold mt-1">₹{item.price}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 rounded-sm bg-surface-container-highest text-on-surface flex items-center justify-center hover:bg-surface-bright transition-colors text-sm">
                      −
                    </button>
                    <span className="text-on-surface text-sm font-medium w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 rounded-sm bg-surface-container-highest text-on-surface flex items-center justify-center hover:bg-surface-bright transition-colors text-sm">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-outline-variant/10 space-y-3">
            <div className="flex justify-between text-on-surface">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-muted/60 text-xs">Taxes and delivery calculated at checkout.</p>
            {/* Table number input */}
            <div>
              <label className="block text-[#a0815a] text-[10px] uppercase tracking-widest font-semibold mb-1.5">
                Table Number
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={tableNumber || ''}
                onChange={e => { setTableNumber(e.target.value); setTableError(''); }}
                placeholder="Enter your table number"
                required
                className="w-full rounded-lg p-3 text-sm bg-[#1a0a02] text-[#f5e6c8] placeholder:text-[#614b38] outline-none"
                style={{ border: '1px solid rgba(255,158,24,0.3)' }}
              />
              {tableError && (
                <p className="text-red-400 text-xs mt-1">{tableError}</p>
              )}
            </div>
            <button onClick={handleViewCart} className="btn-primary w-full text-center">
              View full cart
            </button>
            <button onClick={closeDrawer} className="btn-ghost w-full text-center text-sm">
              Keep browsing
            </button>
          </div>
        )}
      </div>
    </>
  );
}
