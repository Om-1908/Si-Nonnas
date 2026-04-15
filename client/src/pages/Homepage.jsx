import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useCartStore from '../stores/cartStore';
import { showToast } from '../components/Toast';
import api from '../lib/axios';
import { mockMenuItems } from '../lib/mockData';

export default function Homepage() {
  const { addItem } = useCartStore();

  const { data: signatures = [] } = useQuery({
    queryKey: ['signature-menu'],
    queryFn: async () => {
      const { data } = await api.get('/menu/signature');
      // Fallback to first 4 pizzas if no signatures set yet
      if (!data || data.length === 0) {
        const { data: all } = await api.get('/menu?category=pizzas');
        return all.slice(0, 4);
      }
      return data;
    },
    placeholderData: mockMenuItems.filter(i => i.category === 'pizzas').slice(0, 4),
  });

  const handleAdd = (item) => {
    addItem(item);
    showToast(`${item.name} added to cart`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0703] text-white">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative h-[560px] md:h-[620px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=2000&q=85"
          alt="The Original Sourdough Pizza"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Enhanced gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0703]/95 via-[#0f0703]/70 to-[#0f0703]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0703]/90 via-[#0f0703]/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="https://sinonnas.com/wp-content/uploads/2022/06/Logo-3.png"
              alt="Si Nonna's"
              className="max-w-[260px] md:max-w-[300px] brightness-0 invert drop-shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span
              className="hidden font-serif text-4xl font-bold text-[#ffcb8a] tracking-tight"
            >
              Si Nonna's
            </span>
          </div>

          {/* Hero Content */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#ffe4c9] leading-[1.05] mb-6 tracking-tight">
            The Original<br />
            <span className="text-[#FF9E18]">Sourdough Pizza</span>
          </h1>

          <p className="max-w-md text-[#e8d4b8] text-lg md:text-xl leading-relaxed mb-10">
            24-hour fermented sourdough. Fired at 400°C in 90 seconds.<br />
            Tradition reimagined.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="bg-[#FF9E18] hover:bg-[#ffad3d] text-[#2c1700] font-semibold uppercase tracking-widest px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/30"
            >
              Order Now
            </Link>
            <Link
              to="/reservations"
              className="border-2 border-[#d4b38a] hover:border-[#ffe4c9] text-[#ffe4c9] hover:text-white font-semibold uppercase tracking-widest px-10 py-4 rounded-xl transition-all duration-300 hover:bg-white/10"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>

      {/* ── Our Signatures ── */}
      <section className="py-16 px-6 bg-[#1a0a02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
            <div>
              <p className="uppercase tracking-[3px] text-[#a67c5d] text-xs font-medium mb-2">Signature Collection</p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#ffdbbe] font-bold tracking-tight">
                Our Signatures
              </h2>
            </div>

            <Link
              to="/menu"
              className="group flex items-center gap-2 text-[#FF9E18] hover:text-[#ffad3d] font-medium mt-4 sm:mt-0 transition-colors"
            >
              Explore Full Menu
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {signatures.map((item) => (
              <div
                key={item._id || item.id}
                className="group bg-[#24140a] rounded-2xl overflow-hidden border border-[#3a2518] hover:border-[#FF9E18]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/60"
              >
                <div className="relative h-60 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#3a2518] flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-[#5c4633]">local_pizza</span>
                    </div>
                  )}

                  {item.isVeg && (
                    <div className="absolute top-4 left-4 bg-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow-md">
                      VEG
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-[#ffdbbe] text-xl font-semibold mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-[#b38a5f] text-sm line-clamp-2 mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-[#FF9E18] font-serif">
                      ₹{item.price}
                    </div>

                    <button
                      onClick={() => handleAdd(item)}
                      disabled={!item.is_available}
                      className="bg-[#3a2518] hover:bg-[#FF9E18] hover:text-[#2c1700] text-[#FF9E18] font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      {item.is_available ? 'Add to Cart +' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Heritage Story ── */}
      <section
        className="py-20 px-6 bg-[#140903]"
        style={{ position: 'relative' }}
      >
        <div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div>
              <p className="uppercase tracking-[3px] text-[#a67c5d] text-xs font-medium mb-3">From Naples, With Love</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight text-[#ffdbbe] font-bold tracking-tight">
                A pizza story<br />from the heart of Naples
              </h2>
            </div>

            <blockquote className="font-serif text-[#e8d4b8] text-[1.1rem] leading-relaxed border-l-4 border-[#FF9E18] pl-6 italic">
              "It started in a small kitchen in Naples, where my Nonna taught me that the secret to the perfect pizza isn’t just the oven — it’s the time you give the dough to breathe."
            </blockquote>

            <p className="text-[#c9a37a] leading-relaxed text-[15.5px]">
              We honor a heritage sourdough starter passed down through three generations.
              Every dough is hand-stretched and topped with ingredients sourced directly from Italian producers we know personally.
            </p>

            <Link
              to="/story"
              className="inline-flex items-center gap-3 text-[#FF9E18] hover:text-[#ffad3d] font-medium group"
            >
              Read the full story
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          {/* Illustration Container */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="bg-[#24140a] p-8 rounded-3xl border border-[#3a2518] shadow-2xl max-w-[420px]">
              <img
                src="https://sinonnas.com/wp-content/uploads/2022/06/Illustration.svg"
                alt="Naples pizza illustration"
                className="w-full h-auto max-h-[380px] object-contain drop-shadow-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              {/* Fallback Image */}
              <img
                src="https://images.unsplash.com/photo-1555817129-2c96d1c2c85e?w=900&q=85"
                alt="Wood-fired pizza oven"
                className="hidden w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}