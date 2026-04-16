import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import api from '../lib/axios';
import socket from '../lib/socket';
import { mockMenuItems, CATEGORY_LABELS } from '../lib/mockData';
import { showToast } from '../components/Toast';

const CATEGORY_ORDER = ['pizzas', 'panuozzos', 'panzerotto', 'bites', 'fried', 'salads', 'dips', 'desserts', 'gelatos', 'coffee', 'beer_wine', 'beverages', 'soft_drinks', 'sides'];

export default function Menu() {
  const queryClient = useQueryClient();
  const { items, addItem, updateQty, removeItem } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const sectionsRef = useRef({});
  const [activeCategory, setActiveCategory] = useState('');

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => { const { data } = await api.get('/menu'); return data; },
    placeholderData: mockMenuItems,
  });

  useEffect(() => {
    socket.connect();
    socket.on('menu-item-updated', () => queryClient.invalidateQueries({ queryKey: ['menu'] }));
    return () => { socket.off('menu-item-updated'); socket.disconnect(); };
  }, [queryClient]);

  const categories = CATEGORY_ORDER.filter(c => menuItems.some(i => i.category === c));

  const scrollTo = (cat) => {
    setActiveCategory(cat);
    sectionsRef.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cartTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  const handlePlaceOrder = () => {
    if (cartCount === 0) { showToast('Your cart is empty', 'error'); return; }
    if (!user) { navigate('/login?redirect=/order/review'); return; }
    navigate('/order/review');
  };

  const handleAdd = (item) => {
    addItem(item);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a0a02]">
      <Navbar />



      <div className="flex-1 flex flex-col">
        {/* Hero Banner */}
        <div className="relative h-40 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&q=80"
            alt="Our Menu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(26,10,2,0.85)] to-[rgba(0,100,120,0.4)]" />
          <div className="absolute inset-0 flex items-center px-10">
            <h1 className="font-heading text-5xl font-bold text-[#ffdbc7] italic">Our Menu</h1>
          </div>
        </div>

        {/* Main layout: content + cart sidebar */}
        <div className="flex flex-1 max-w-[1400px] w-full mx-auto px-4 py-6 gap-6">

          {/* Left: Menu Content */}
          <div className="flex-1 min-w-0">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => scrollTo(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-[2px] text-xs font-semibold uppercase tracking-wider transition-all ${activeCategory === cat
                    ? 'bg-[#FF9E18] text-[#2c1700]'
                    : 'bg-[#2e1b0e] text-[#a0815a] hover:bg-[#3a2518] hover:text-[#ffdbc7]'
                    }`}>
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>

            {/* Menu Sections */}
            {categories.map(cat => {
              const catItems = menuItems.filter(i => i.category === cat);
              if (!catItems.length) return null;
              return (
                <section key={cat} ref={el => (sectionsRef.current[cat] = el)} className="mb-10 scroll-mt-8">
                  <div className="mb-4">
                    <p className="text-[#a0815a] text-[9px] uppercase tracking-[0.2em]">Category</p>
                    <h2 className="font-heading text-2xl font-bold text-[#ffdbc7] italic">{CATEGORY_LABELS[cat] || cat}</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {catItems.map(item => (
                      <div key={item._id} className={`bg-[#2e1b0e] rounded-[4px] overflow-hidden hover:bg-[#3a2518] transition-colors ${!item.is_available ? 'opacity-50' : ''}`}>
                        {item.imageUrl && (
                          <div className="h-44 overflow-hidden">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-3 h-3 border-2 rounded-sm flex-shrink-0 ${item.isVeg ? 'border-green-500' : 'border-red-500'}`} />
                              <h3 className="font-heading text-[#ffdbc7] font-semibold text-sm leading-tight">{item.name}</h3>
                            </div>
                          </div>
                          <p className="text-[#a0815a] text-xs mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-heading text-[#FF9E18] font-bold">₹{item.price}</span>
                            {item.is_available ? (
                              <button onClick={() => handleAdd(item)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-[2px] bg-[#463022] text-[#FF9E18] hover:bg-[#FF9E18] hover:text-[#2c1700] transition-colors uppercase tracking-wider">
                                Add +
                              </button>
                            ) : (
                              <span className="text-xs text-[#544434] font-medium">Sold out</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Right: Order Sidebar */}
          <div className="w-72 flex-shrink-0 hidden lg:block">
            <div className="sticky top-6">
              <div className="bg-[#2e1b0e] rounded-[4px] overflow-hidden">
                {/* Cart Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[#463022]">
                  <span className="material-symbols-outlined text-[#FF9E18]">restaurant</span>
                  <div>
                    <p className="text-[#ffdbc7] font-semibold text-sm">Your Order</p>
                    <p className="text-[#a0815a] text-xs">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Cart Items */}
                {items.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <span className="material-symbols-outlined text-3xl text-[#463022] mb-2 block">shopping_bag</span>
                    <p className="text-[#544434] text-xs">Start building your order from the menu</p>
                  </div>
                ) : (
                  <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
                    {items.map(item => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[#ffdbc7] text-xs font-medium truncate">{item.name}</p>
                          <p className="text-[#a0815a] text-[10px]">₹{item.price} × {item.qty}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-5 h-5 bg-[#463022] text-[#ffdbc7] rounded-[1px] flex items-center justify-center text-xs hover:bg-[#544434]">−</button>
                          <span className="text-[#ffdbc7] text-xs w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-5 h-5 bg-[#463022] text-[#ffdbc7] rounded-[1px] flex items-center justify-center text-xs hover:bg-[#544434]">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotal + CTA */}
                {items.length > 0 && (
                  <div className="px-5 py-4 border-t border-[#463022]">
                    <div className="flex justify-between mb-4">
                      <span className="text-[#a0815a] text-sm">Subtotal</span>
                      <span className="text-[#ffdbc7] font-heading font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={handlePlaceOrder}
                      className="w-full bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.08em] py-3 rounded-[2px] hover:bg-[#ffb84d] transition-colors text-xs">
                      Place Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
