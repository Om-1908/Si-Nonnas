import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { useState } from 'react';

const sidebarLinks = [
  { label: 'Overview', to: '/manager', icon: 'dashboard', end: true },
  { label: 'All Orders', to: '/manager/orders', icon: 'receipt_long' },
  { label: 'Reservations', to: '/manager/reservations', icon: 'event_seat' },
  { label: 'Menu', to: '/manager/menu', icon: 'restaurant_menu' },
  { label: 'Sales Analytics', to: '/manager/analytics', icon: 'analytics' },
  { label: 'Reviews', to: '/manager/reviews', icon: 'grade' },
  { label: 'Payment Audit', to: '/manager/payments', icon: 'account_balance' },
];

export default function ManagerLayout() {
  const { user, clear } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-surface-container-lowest overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-surface-container flex flex-col border-r border-outline-variant/10 transition-all duration-300 flex-shrink-0`}>
        {/* Brand */}
        <div className="px-4 py-5 flex items-center justify-between border-b border-outline-variant/10">
          {!collapsed && (
            <span className="font-heading text-lg font-bold text-primary-container">Si Nonna's</span>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-muted hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-xl">{collapsed ? 'menu_open' : 'menu'}</span>
          </button>
        </div>

        {/* Manager info */}
        {!collapsed && user && (
          <div className="px-4 py-3 border-b border-outline-variant/10">
            <p className="text-on-surface text-sm font-medium truncate">{user.name}</p>
            <p className="text-muted text-xs">Manager</p>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-container/15 text-primary'
                    : 'text-muted hover:text-on-surface hover:bg-surface-container-high'
                }`
              }
            >
              <span className="material-symbols-outlined text-xl">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 py-3 border-t border-outline-variant/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted hover:text-error hover:bg-error-container/10 w-full transition-all duration-200">
            <span className="material-symbols-outlined text-xl">logout</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
