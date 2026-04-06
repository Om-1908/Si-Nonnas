import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const timeline = [
  { year: '1984', title: 'The First Oven', desc: "Nonna Rosa lights the first wood-fired oven in a tiny Naples kitchen. The sourdough starter that still lives in every Si Nonna's kitchen is born." },
  { year: '1998', title: 'The Recipe Travels', desc: 'Her grandson carries the starter and the family binder of recipes to Mumbai. The first experimental dough proves for 24 hours in a tiny flat.' },
  { year: '2011', title: 'First Restaurant', desc: "Si Nonna's opens its doors in Lower Parel, Mumbai. The 48-seat trattoria sells out every night within the first week." },
  { year: '2018', title: 'The Expansion', desc: 'The brand grows to 12 cities across India. The original sourdough starter travels with every head chef — there is only one lineage.' },
  { year: 'Today', title: '41 Stores & Counting', desc: "Over 40 locations, the same starter, the same promise. Every pizza is a direct descendent of Nonna Rosa's 1984 original." },
];

const promises = [
  { icon: '🌿', title: 'No Shortcuts', desc: 'Every dough ball proves for a minimum of 24 hours. No yeast accelerators, no additives. Time is the only ingredient we add extra of.' },
  { icon: '🇮🇹', title: 'Italian Sourcing', desc: 'San Marzano D.O.P tomatoes, Fior di Latte from Campania, and Bronte pistachios from Sicily. We know the farms and the farmers by name.' },
  { icon: '🔥', title: 'Blast-cooked at 400°C', desc: 'A traditional wood-fired dome oven reaches 400°C. Ninety seconds is all it takes. The crust leopards; the centre stays soft and pillowy.' },
];

export default function OurStory() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a0a02]">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555817129-2c96d1c2c85e?w=1600&q=80"
          alt="Naples pizza story"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(26,10,2,0.55)] via-[rgba(26,10,2,0.4)] to-[rgba(26,10,2,0.9)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[#FF9E18] text-[10px] uppercase tracking-[0.25em] mb-4">Our Heritage</p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-[#ffdbc7] italic leading-tight max-w-2xl">
            A pizza story from Naples
          </h1>
          <p className="text-[#dac2ae] text-base mt-5 max-w-lg leading-relaxed">
            Since 1984, one sourdough starter has been the heartbeat of every pizza we make.
          </p>
        </div>
      </section>

      {/* ── NAPLES STORY — alternating image-text ── */}
      <section className="py-20 px-6 bg-[#1a0a02]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-3">The Beginning</p>
            <h2 className="font-heading text-4xl font-bold text-[#ffdbc7] italic mb-6 leading-tight">
              Nonna Rosa's<br />kitchen, 1984
            </h2>
            <p className="text-[#a0815a] text-sm leading-loose mb-4">
              In a narrow side street in the Quartieri Spagnoli of Naples, a grandmother named Rosa Esposito maintained a sourdough starter she had received from her own mother. She called it <em className="text-[#ffc589]">"il cuore"</em> — the heart.
            </p>
            <p className="text-[#a0815a] text-sm leading-loose mb-4">
              Every morning before sunrise, she would feed it. Every evening, she would stretch and fold the living dough by hand, reading its texture the way a doctor reads a pulse. The oven never dropped below 380°C.
            </p>
            <p className="text-[#a0815a] text-sm leading-loose">
              Her recipe was never written down until her grandson, Arjun, begged her to. He filled an entire spiral notebook. That notebook now lives under glass at our Lower Parel flagship.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=800&q=80"
              alt="Naples kitchen"
              className="w-full h-[420px] object-cover rounded-[2px]"
            />
            <div className="absolute -bottom-5 -left-5 bg-[#FF9E18] text-[#2c1700] p-4 rounded-[2px] shadow-xl">
              <p className="font-heading font-bold text-2xl">1984</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider">The First Starter</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE DOUGH SECTION — reversed ── */}
      <section className="py-20 px-6 bg-[#200f04]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <img
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80"
              alt="Sourdough dough process"
              className="w-full h-[420px] object-cover rounded-[2px]"
            />
            <blockquote className="absolute -bottom-5 -right-5 bg-[#2e1b0e] border-l-4 border-[#FF9E18] px-5 py-4 max-w-xs rounded-[2px] shadow-xl">
              <p className="text-[#ffdbc7] text-sm italic font-heading leading-relaxed">
                "The dough doesn't lie. If you rush it, it tells you."
              </p>
              <cite className="text-[#a0815a] text-[10px] uppercase tracking-wider not-italic mt-2 block">— Arjun, Head Baker</cite>
            </blockquote>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-3">The Dough</p>
            <h2 className="font-heading text-4xl font-bold text-[#ffdbc7] italic mb-6 leading-tight">
              Proved for 24 hours.<br />No exceptions.
            </h2>
            <p className="text-[#a0815a] text-sm leading-loose mb-4">
              Our dough is made every morning with Tipo 00 artisan flour stone-milled in Puglia. The sourdough starter — a direct descendant of il cuore — is added at exactly 20% hydration. The autolyse stage lasts 45 minutes.
            </p>
            <p className="text-[#a0815a] text-sm leading-loose mb-4">
              After bulk fermentation and hand folding, each ball rests in a cold retarder for no less than 24 hours. Time is not a constraint here — it is the main ingredient.
            </p>
            <p className="text-[#a0815a] text-sm leading-loose">
              At service, each ball is hand-stretched — never rolled — to a 30cm disc. The edges are left thick, the centre paper-thin. Into the dome it goes.
            </p>
          </div>
        </div>
      </section>

      {/* ── OUR PROMISE — 3 column ── */}
      <section className="py-20 px-6 bg-[#1a0a02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-3">Our Promise</p>
            <h2 className="font-heading text-4xl font-bold text-[#ffdbc7] italic">
              Three things we will never compromise on
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promises.map(p => (
              <div key={p.title} className="bg-[#2e1b0e] rounded-[2px] p-8 text-center hover:bg-[#3a2518] transition-colors group">
                <div className="text-4xl mb-5">{p.icon}</div>
                <h3 className="font-heading text-xl font-bold text-[#ffdbc7] mb-3">{p.title}</h3>
                <p className="text-[#a0815a] text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ── */}
      <section className="py-20 px-6 bg-[#200f04]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-3">The Journey</p>
            <h2 className="font-heading text-4xl font-bold text-[#ffdbc7] italic">
              From one oven to 41
            </h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#2e1b0e]" />
            <div className="space-y-10">
              {timeline.map((t) => (
                <div key={t.year} className="flex gap-8 items-start">
                  {/* Dot + year */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-9 h-9 bg-[#FF9E18] rounded-full flex items-center justify-center shadow-lg z-10">
                      <span className="w-3 h-3 bg-[#2c1700] rounded-full" />
                    </div>
                    <span className="text-[#FF9E18] font-heading font-bold text-xs mt-2">{t.year}</span>
                  </div>
                  <div className="flex-1 bg-[#2e1b0e] rounded-[2px] p-5 hover:bg-[#3a2518] transition-colors">
                    <h3 className="font-heading text-[#ffdbc7] font-bold text-base mb-1">{t.title}</h3>
                    <p className="text-[#a0815a] text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-[#1a0a02] text-center">
        <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-4">Experience It</p>
        <h2 className="font-heading text-4xl font-bold text-[#ffdbc7] italic mb-8">
          Now it's your turn to taste the story
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/menu"
            className="bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.1em] px-10 py-4 rounded-[2px] hover:bg-[#ffb84d] transition-colors text-sm">
            Explore the Menu
          </Link>
          <Link to="/reservations"
            className="border border-[#a0815a] text-[#ffdbc7] uppercase tracking-[0.1em] px-10 py-4 rounded-[2px] hover:border-[#ffdbc7] transition-colors text-sm">
            Reserve a Table
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
