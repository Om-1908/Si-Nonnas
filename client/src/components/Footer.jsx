import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#160802] mt-auto border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand — official logo at h=48px */}
          <div>
            <div className="mb-5">
              <img
                src="https://sinonnas.com/wp-content/uploads/2022/06/Logo-3.png"
                alt="Si Nonna's"
                style={{ height: '48px', width: 'auto' }}
                className="object-contain brightness-0 invert"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span
                className="hidden font-heading text-xl font-bold text-[#ffc589] italic"
                style={{ fontFamily: "'Noto Serif',Georgia,serif" }}
              >
                Si Nonna's
              </span>
            </div>
            <p className="text-[#614b38] text-sm leading-relaxed">
              Preserving the soul of Neapolitan sourdough pizza since 1984. Every bite a tribute to tradition.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-[#2e1b0e] rounded-full flex items-center justify-center text-[#a0815a] hover:text-[#FF9E18] hover:bg-[#3a2518] transition-colors">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-[#2e1b0e] rounded-full flex items-center justify-center text-[#a0815a] hover:text-[#FF9E18] hover:bg-[#3a2518] transition-colors">
                <span className="material-symbols-outlined text-sm">thumb_up</span>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[#a0815a] text-[10px] font-semibold uppercase tracking-[0.18em] mb-5">Explore</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Our Story', to: '/story' },
                { label: 'Ingredients', to: '/ingredients' },
                { label: 'Menu', to: '/menu' },
                { label: 'Reservations', to: '/reservations' },
                { label: 'Login', to: '/login' },
              ].map((l) => (
                <Link key={l.to} to={l.to}
                  className="text-[#614b38] hover:text-[#ffdbc7] text-sm transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#a0815a] text-[10px] font-semibold uppercase tracking-[0.18em] mb-5">Get in Touch</h4>
            <div className="text-[#614b38] text-sm space-y-2 leading-relaxed">
              <p>124 Artisanal Way, Bandra West</p>
              <p>Mumbai, MH 400050</p>
              <p className="mt-3">+91 22 7123 4567</p>
              <a href="mailto:ciao@sinonnas.com" className="hover:text-[#ffdbc7] transition-colors">ciao@sinonnas.com</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.05)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#3a2518] text-xs">© 2024 Si Nonna's. All rights reserved.</p>
          <div className="flex gap-5">
            <span className="text-[#3a2518] text-xs hover:text-[#614b38] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-[#3a2518] text-xs hover:text-[#614b38] cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
