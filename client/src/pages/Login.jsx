import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import api from '../lib/axios';
import { showToast } from '../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      setAuth(data.user, data.role, data.token);
      if (data.role === 'manager') navigate('/manager');
      else if (data.role === 'kitchen_staff') navigate('/kitchen');
      else navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Root: full viewport, no padding, no margin, no rounded corners */
    <div className="flex flex-col md:flex-row w-screen min-h-screen overflow-hidden">

      {/* ── LEFT PANEL — brand / photo ── */}
      {/* Mobile: slim 120px strip. Desktop: exactly 50vw full height */}
      <div className="relative flex-shrink-0 h-[120px] md:h-auto md:w-[50vw] overflow-hidden">
        <img
          src="https://b.zmtcdn.com/data/pictures/7/20906977/1d655bade4c6dfd283d0f5cd235d5bcb.jpg"
          alt="Pizza oven"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,10,2,0.90)] via-[rgba(26,10,2,0.35)] to-[rgba(255,158,24,0.12)]" />

        {/* Brand content */}
        <div className="relative z-10 h-full flex flex-col px-10 py-8">
          {/* Logo — top left */}
          <div className="flex flex-col leading-none">
            <img
              src="https://sinonnas.com/wp-content/uploads/2022/06/Logo-3.png"
              alt="Si Nonna's"
              className="h-[36px] w-auto object-contain brightness-0 invert"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
            <span className="hidden font-heading text-2xl font-bold text-[#ffc589] italic" style={{ fontFamily: "'Noto Serif',Georgia,serif" }}>
              Si Nonna's
            </span>
          </div>

          {/* Stats cards — bottom left, desktop only */}
          <div className="hidden md:flex gap-3 mt-auto">
            {[
              { label: 'NETWORK', value: '41 Stores' },
              { label: 'PRESENCE', value: '12 Cities' },
              { label: 'HERITAGE', value: 'Since 2011' },
            ].map(s => (
              <div key={s.label} className="flex-1 bg-[rgba(255,240,215,0.92)] rounded-[3px] p-3">
                <p className="text-[#a0815a] text-[9px] uppercase tracking-widest font-semibold">{s.label}</p>
                <p className="text-[#FF9E18] font-heading font-bold text-sm leading-tight">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      {/* Mobile: fills remaining viewport. Desktop: exactly 50vw */}
      <div className="flex-1 md:w-[50vw] bg-[#1a0a02] flex flex-col justify-between px-10 py-10 md:py-16 overflow-y-auto">
        <div>
          {/* Mobile logo */}
          <div className="md:hidden mb-6">
            <img
              src="https://sinonnas.com/wp-content/uploads/2022/06/Logo-3.png"
              alt="Si Nonna's"
              className="h-8 w-auto object-contain brightness-0 invert"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
            <span className="hidden font-heading text-xl font-bold text-[#FF9E18] italic">Si Nonna's</span>
          </div>

          <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.18em] font-semibold mb-2">Staff Portal</p>
          <h1 className="font-heading text-4xl font-bold text-[#ffdbc7] mb-10">Welcome back</h1>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-sm">
            <div>
              <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full bg-[#2e1b0e] text-[#ffdbc7] border-0 border-b-2 border-[#544434] px-4 py-3 focus:border-[#FF9E18] focus:ring-0 focus:outline-none placeholder:text-[#544434] transition-colors"
              />
            </div>

            <div>
              <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#2e1b0e] text-[#ffdbc7] border-0 border-b-2 border-[#544434] px-4 py-3 focus:border-[#FF9E18] focus:ring-0 focus:outline-none placeholder:text-[#544434] transition-colors pr-10"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0815a] hover:text-[#ffdbc7] transition-colors">
                  <span className="material-symbols-outlined text-lg">{show ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.remember}
                  onChange={e => setForm({ ...form, remember: e.target.checked })}
                  className="rounded border-[#544434] bg-[#2e1b0e] text-[#FF9E18] focus:ring-0" />
                <span className="text-[#a0815a] text-xs">Remember me</span>
              </label>
              <button type="button" className="text-[#a0815a] text-xs hover:text-[#ffc589] transition-colors">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.12em] py-4 hover:bg-[#ffb84d] transition-colors disabled:opacity-50 text-sm">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#2e1b0e]" />
              <span className="text-[#544434] text-[10px] uppercase tracking-widest">or continue as</span>
              <div className="flex-1 h-px bg-[#2e1b0e]" />
            </div>

            <Link to="/"
              className="block w-full border border-[#544434] text-[#a0815a] uppercase tracking-[0.1em] py-3 text-center text-xs font-semibold hover:border-[#a0815a] hover:text-[#ffdbc7] transition-colors">
              Browse as Guest
            </Link>
          </form>
        </div>

        <p className="text-[#2e1b0e] text-[10px] text-center mt-10 select-none">
          © 2024 Si Nonna's. Crafted for the Modern Trattoria. All rights reserved.
        </p>
      </div>
    </div>
  );
}
