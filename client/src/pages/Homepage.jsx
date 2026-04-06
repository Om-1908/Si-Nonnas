import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useCartStore from '../stores/cartStore';
import { showToast } from '../components/Toast';
import api from '../lib/axios';
import { mockMenuItems } from '../lib/mockData';

const quickActions = [
  { icon: 'qr_code_2', title: 'Scan QR & Order', desc: 'Skip the queue, order from your table.', to: '/qr-menu/demo' },
  { icon: 'local_shipping', title: 'Track my order', desc: 'Real-time updates from oven to door.', to: '/profile' },
  { icon: 'event_seat', title: 'Make a reservation', desc: 'Secure your spot at our hearth.', to: '/reservations' },
  { icon: 'restaurant_menu', title: 'View full menu', desc: 'Explore our seasonal Italian delights.', to: '/menu' },
];

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
      <section className="relative h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1600&q=80"
          alt="The Original Sourdough Pizza"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(26,10,2,0.75)] via-[rgba(26,10,2,0.5)] to-[rgba(26,10,2,0.3)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,10,2,0.8)] via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-20">
          <p className="text-[#FF9E18] text-xs uppercase tracking-[0.2em] font-medium mb-3">Si Nonna's</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-[#ffdbc7] leading-tight mb-4 italic">
            The Original<br />Sourdough Pizza
          </h1>
          <p className="text-[#dac2ae] text-base mb-8 max-w-md leading-relaxed">
            Proved for 24 hours. Blast-cooked at 400°C for 90 seconds. Heritage craft, modern soul.
          </p>
          <div className="flex gap-4">
            <Link to="/menu" className="bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.08em] px-8 py-3 rounded-[2px] hover:bg-[#ffb84d] transition-colors text-sm">
              Order Now
            </Link>
            <Link to="/reservations" className="border border-[#a0815a] text-[#ffdbc7] uppercase tracking-[0.08em] px-8 py-3 rounded-[2px] hover:border-[#ffdbc7] transition-colors text-sm">
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Action Cards ── */}
      <section className="bg-[#200f04] py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(a => (
            <Link key={a.title} to={a.to} className="bg-[#2e1b0e] rounded-[4px] p-5 group hover:bg-[#3a2518] transition-colors">
              <span className="material-symbols-outlined text-[#FF9E18] text-2xl mb-3 block group-hover:scale-110 transition-transform">{a.icon}</span>
              <h3 className="font-heading text-[#ffdbc7] font-semibold text-sm mb-1">{a.title}</h3>
              <p className="text-[#a0815a] text-xs leading-relaxed">{a.desc}</p>
            </Link>
          ))}
        </div>
      </section>

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
            <Link to="/menu" className="inline-flex items-center gap-2 text-[#FF9E18] text-sm font-medium hover:underline">
              Read our story <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="relative h-72 rounded-[4px] overflow-hidden">
            <img
              src="https://sinonnas.com/wp-content/uploads/2022/06/Illustration.svg"
              alt="Wood-fired pizza oven"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-[rgba(46,27,14,0.85)] rounded-[2px] px-3 py-2 backdrop-blur-sm">
              <p className="text-[#a0815a] text-[9px] uppercase tracking-wider">Preserving the soul of Neapolitan sourdough</p>
              <p className="text-[#FF9E18] text-xs font-semibold">Heritage since 1984</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
