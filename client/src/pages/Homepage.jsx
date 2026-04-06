import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useCartStore from '../stores/cartStore';
import { showToast } from '../components/Toast';
import api from '../lib/axios';
import { mockMenuItems } from '../lib/mockData';

export default function Homepage() {
  const { addItem } = useCartStore();
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    api.get('/menu?category=pizzas&limit=4')
      .then(r => setSignatures(r.data.slice(0, 4)))
      .catch(() => setSignatures(mockMenuItems.filter(i => i.category === 'pizzas').slice(0, 4)));
  }, []);

  const handleAdd = (item) => {
    addItem(item);
    showToast(`${item.name} added to cart`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a0a02]">
      <Navbar />

      {/* ── Hero — Full-width pizza image ── */}
      <section className="relative h-[520px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1600&q=80"
          alt="The Original Sourdough Pizza"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(26,10,2,0.80)] via-[rgba(26,10,2,0.55)] to-[rgba(26,10,2,0.25)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,10,2,0.85)] via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-20">
          {/* Fix 7: Official logo in hero */}
          <div className="mb-5">
            <img
              src="https://sinonnas.com/wp-content/uploads/2022/06/Logo-3.png"
              alt="Si Nonna's"
              style={{ maxWidth: '280px', width: 'auto' }}
              className="object-contain brightness-0 invert"
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span
              className="hidden font-heading text-3xl font-bold text-[#ffc589] italic"
              style={{ fontFamily: "'Noto Serif',Georgia,serif" }}
            >
              Si Nonna's
            </span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-[#ffdbc7] leading-tight mb-4 italic">
            The Original<br />Sourdough Pizza
          </h1>
          <p className="text-[#dac2ae] text-base mb-8 max-w-md leading-relaxed">
            Proved for 24 hours. Blast-cooked at 400°C for 90 seconds. Heritage craft, modern soul.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/menu" className="bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.08em] px-8 py-3 rounded-[2px] hover:bg-[#ffb84d] transition-colors text-sm">
              Order Now
            </Link>
            <Link to="/reservations" className="border border-[#a0815a] text-[#ffdbc7] uppercase tracking-[0.08em] px-8 py-3 rounded-[2px] hover:border-[#ffdbc7] transition-colors text-sm">
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Fix 6: Quick Action Cards REMOVED entirely */}

      {/* ── Our Signatures ── */}
      <section className="py-14 px-6 bg-[#1a0a02]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-1">Featured Items</p>
              <h2 className="font-heading text-3xl font-bold text-[#ffdbc7] italic">Our Signatures</h2>
            </div>
            <Link to="/menu" className="text-[#FF9E18] text-sm hover:underline flex items-center gap-1">
              View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {signatures.map(item => (
              <div key={item._id} className="bg-[#2e1b0e] rounded-[4px] overflow-hidden group hover:bg-[#3a2518] transition-colors">
                <div className="relative h-48 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-[#3a2518] flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#544434]">local_pizza</span>
                    </div>
                  )}
                  {item.isVeg && (
                    <span className="absolute top-2 left-2 bg-green-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider">Veg</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-[#ffdbc7] font-semibold text-sm mb-1 leading-tight">{item.name}</h3>
                  <p className="text-[#a0815a] text-xs mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF9E18] font-bold font-heading">₹{item.price}</span>
                    <button
                      onClick={() => handleAdd(item)}
                      disabled={!item.is_available}
                      className="bg-[#463022] text-[#FF9E18] text-xs font-semibold px-3 py-1.5 rounded-[2px] hover:bg-[#FF9E18] hover:text-[#2c1700] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {item.is_available ? 'Add +' : 'Sold out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Heritage Story ── */}
      <section className="py-14 px-6 bg-[#200f04]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-3">Our Heritage</p>
            <h2 className="font-heading text-3xl font-bold text-[#ffdbc7] italic mb-5 leading-tight">
              A pizza story from<br />Naples
            </h2>
            <blockquote className="font-heading text-[#dac2ae] italic text-base leading-relaxed mb-5">
              "It started in a small kitchen in the heart of Naples, where my Nonna taught me that the secret to the perfect pizza isn't just the oven — it's the time you give the dough to breathe."
            </blockquote>
            <p className="text-[#a0815a] text-sm leading-relaxed mb-6">
              We use a heritage sourdough starter passed down through three generations. Every ball of dough is hand-stretched and topped with the finest ingredients sourced directly from Italian farmers we know by name.
            </p>
            <Link to="/story" className="inline-flex items-center gap-2 text-[#FF9E18] text-sm font-medium hover:underline">
              Read our story <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Fix 5: Illustration capped at 380×340, object-contain */}
          <div className="flex items-center justify-center rounded-[4px] overflow-hidden bg-[#2e1b0e] p-4">
            <img
              src="https://sinonnas.com/wp-content/uploads/2022/06/Illustration.svg"
              alt="Naples pizza illustration"
              style={{ maxWidth: '380px', maxHeight: '340px', width: '100%', objectFit: 'contain' }}
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback photo */}
            <img
              src="https://images.unsplash.com/photo-1555817129-2c96d1c2c85e?w=800&q=80"
              alt="Wood-fired pizza oven"
              className="hidden w-full h-72 object-cover"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
