import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ingredients = [
  {
    name: 'The Dough',
    svg: 'https://sinonnas.com/wp-content/uploads/2022/07/Dough-Icon.svg',
    desc: 'A living sourdough starter from 1984, fed daily with stone-milled Tipo 00 flour from Puglia. Proved for 24 hours minimum.',
  },
  {
    name: 'Buffalo Mozzarella',
    svg: 'https://sinonnas.com/wp-content/uploads/2022/07/Cheese-Icon.svg',
    desc: 'Fior di Latte and Buffalo Mozzarella sourced directly from small-batch cheesemakers in Campania, Italy.',
  },
  {
    name: 'San Marzano Tomatoes',
    svg: 'https://sinonnas.com/wp-content/uploads/2022/07/Tomatoes.svg',
    desc: 'D.O.P certified San Marzano tomatoes grown in the volcanic soil of Mount Vesuvius. Hand-crushed, never cooked before baking.',
  },
  {
    name: 'Extra Virgin Olive Oil',
    svg: 'https://sinonnas.com/wp-content/uploads/2022/07/EVOO.svg',
    desc: 'Cold-first-pressed EVOO from a single-estate grove in Calabria. Applied only after the pizza exits the oven.',
  },
  {
    name: 'Artisan Flour',
    svg: 'https://sinonnas.com/wp-content/uploads/2022/07/Flour.svg',
    desc: 'Stone-milled Tipo 00 from a 200-year-old mill in Puglia. High protein, low enzyme activity — perfect for long fermentation.',
  },
  {
    name: 'Fresh Vegetables',
    svg: 'https://sinonnas.com/wp-content/uploads/2022/07/Vegetables.svg',
    desc: 'Hydroponically grown herbs and seasonal produce. Harvested within 48 hours of plating so every leaf is at peak vitality.',
  },
  {
    name: 'Speciality Coffee',
    svg: 'https://sinonnas.com/wp-content/uploads/2022/07/Coffee.svg',
    desc: 'Our house espresso blend is sourced from small cooperative farms in Coorg. Roasted fresh weekly, never more than 14 days old.',
  },
];

export default function Ingredients() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a0a02]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80"
          alt="Ingredients"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,10,2,0.5)] via-[rgba(26,10,2,0.4)] to-[rgba(26,10,2,0.95)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[#FF9E18] text-[10px] uppercase tracking-[0.25em] mb-4">100% Honest</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-[#ffdbc7] italic leading-tight max-w-3xl">
            What goes into every pizza
          </h1>
          <p className="text-[#dac2ae] text-base mt-5 max-w-xl leading-relaxed">
            We list every ingredient on our menu. No asterisks, no fillers, no approximations.
          </p>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="bg-[#200f04] py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#FF9E18] text-6xl font-heading italic leading-none block mb-4">"</span>
          <blockquote className="font-heading text-2xl md:text-3xl text-[#ffdbc7] italic leading-snug">
            We'd rather have fewer toppings and know exactly where they come from than pile on ingredients whose provenance is a mystery.
          </blockquote>
          <cite className="text-[#a0815a] text-xs uppercase tracking-[0.2em] not-italic mt-6 block">
            — Arjun Esposito, Founder
          </cite>
        </div>
      </section>

      {/* ── INGREDIENTS GRID ── */}
      <section className="py-20 px-6 bg-[#1a0a02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-3">The Building Blocks</p>
            <h2 className="font-heading text-4xl font-bold text-[#ffdbc7] italic">
              Seven ingredients. One promise.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ingredients.map(ing => (
              <div
                key={ing.name}
                className="bg-[#2e1b0e] rounded-[2px] p-7 flex flex-col items-center text-center group hover:bg-[#3a2518] transition-colors"
              >
                {/* SVG icon from sinonnas.com */}
                <div className="w-20 h-20 mb-5 flex items-center justify-center">
                  <img
                    src={ing.svg}
                    alt={ing.name}
                    className="max-w-[64px] max-h-[64px] object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback emoji */}
                  <div className="hidden w-16 h-16 rounded-full bg-[#463022] items-center justify-center text-3xl">🍕</div>
                </div>
                <h3 className="font-heading text-[#ffdbc7] font-bold text-base mb-2">{ing.name}</h3>
                <p className="text-[#a0815a] text-xs leading-relaxed">{ing.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HYDROPONICS FEATURE ── */}
      <section className="py-20 px-6 bg-[#2d5016]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-[rgba(255,255,255,0.6)] text-[10px] uppercase tracking-[0.2em] mb-3">Innovation</p>
            <h2 className="font-heading text-4xl font-bold text-white italic mb-5 leading-tight">
              Hydroponically grown,<br />harvested for you
            </h2>
            <p className="text-[rgba(255,255,255,0.75)] text-sm leading-loose mb-5">
              Our fresh herbs — basil, rocket, microgreens — are grown hydroponically in controlled environments within 10km of every restaurant. They arrive within 24 hours of harvest, never chilled below 4°C.
            </p>
            <p className="text-[rgba(255,255,255,0.75)] text-sm leading-loose mb-5">
              No pesticides, no soil-borne pathogens, no days-long cold-chain. What you taste is what was grown yesterday.
            </p>
            <div className="flex gap-6 mt-8">
              {[
                { val: '10km', label: 'Max farm distance' },
                { val: '24h', label: 'Harvest to table' },
                { val: '0', label: 'Pesticides used' },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-heading text-3xl font-bold text-[#a8e06a]">{s.val}</p>
                  <p className="text-[rgba(255,255,255,0.55)] text-[10px] uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=800&q=80"
              alt="Hydroponics farm"
              className="w-full h-[380px] object-cover rounded-[2px]"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-[#1a0a02] text-center">
        <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-4">Taste the Difference</p>
        <h2 className="font-heading text-4xl font-bold text-[#ffdbc7] italic mb-8">
          Now you know what's in it
        </h2>
        <Link to="/menu"
          className="inline-block bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.1em] px-12 py-4 rounded-[2px] hover:bg-[#ffb84d] transition-colors text-sm">
          See the Menu
        </Link>
      </section>

      <Footer />
    </div>
  );
}
