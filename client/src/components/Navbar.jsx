import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';

export default function Navbar() {
  const { user, role, clear } = useAuthStore();
  const { items, openDrawer } = useCartStore();
  const navigate = useNavigate();
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const handleLogout = () => {
    clear();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(26,10,2,0.92)] backdrop-blur-md border-b border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — Official Si Nonna's PNG */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img
              src="https://sinonnas.com/wp-content/uploads/2022/06/Logo-3.png"
              alt="Si Nonna's"
              style={{ height: '36px', width: 'auto' }}
              className="object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback wordmark */}
            <span
              className="hidden font-heading text-xl font-bold text-[#ffc589] italic tracking-tight"
              style={{ fontFamily: "'Noto Serif',Georgia,serif" }}
            >
              Si Nonna's
            </span>
          </Link>

          {/* Nav Links — no Contact */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home', to: '/' },
              { label: 'Our Story', to: '/story' },
              { label: 'Ingredients', to: '/ingredients' },
              { label: 'Menu', to: '/menu' },
              { label: 'Reserve a Table', to: '/reservations' },
            ].map((l) => (
              <Link key={l.to} to={l.to}
                className="text-[#dac2ae] hover:text-[#ffdbc7] text-xs font-medium uppercase tracking-[0.08em] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button onClick={openDrawer}
              className="relative p-1.5 text-[#a0815a] hover:text-[#ffdbc7] transition-colors"
              aria-label="Open cart">
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FF9E18] text-[#2c1700] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <>
                <Link to="/profile"
                  className="text-[#a0815a] hover:text-[#ffdbc7] text-xs font-medium uppercase tracking-wider transition-colors hidden sm:block">
                  My Orders
                </Link>
                <button onClick={handleLogout}
                  className="text-[#a0815a] hover:text-[#ffdbc7] text-xs font-medium uppercase tracking-wider transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-[#a0815a] hover:text-[#ffdbc7] text-xs font-medium uppercase tracking-wider transition-colors">
                  Login
                </Link>
                <Link to="/signup"
                  className="bg-[#FF9E18] text-[#2c1700] text-xs font-bold uppercase tracking-[0.08em] px-5 py-2 rounded-[2px] hover:bg-[#ffb84d] transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
