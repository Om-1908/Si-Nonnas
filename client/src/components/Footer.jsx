import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low mt-auto border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl font-bold text-primary-container mb-3">Si Nonna's</h3>
            <p className="text-muted text-sm leading-relaxed">
              Preserving the soul of Neapolitan sourdough pizza since 1984. Every bite a tribute to tradition.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Explore</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Menu', to: '/menu' },
                { label: 'Reserve', to: '/reservations' },
                { label: 'Login', to: '/login' },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="text-muted hover:text-primary text-sm transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Get in Touch</h4>
            <div className="text-muted text-sm space-y-1">
              <p>124 Artisanal Way, Bandra West</p>
              <p>Mumbai, MH 400050</p>
              <p>+91 22 7123 4567</p>
              <p>ciao@sinonnas.com</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted/60 text-xs">© 2024 Si Nonna's. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-muted/60 text-xs hover:text-muted cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-muted/60 text-xs hover:text-muted cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
