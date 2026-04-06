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
    <div className="min-h-screen bg-[#1a0a02] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl flex rounded-[4px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

        {/* Left Panel — Pizza Oven Photo + Brand */}
        <div className="relative w-[55%] hidden md:block overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80"
            alt="Pizza oven"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,10,2,0.85)] via-[rgba(26,10,2,0.3)] to-[rgba(255,158,24,0.15)]" />

          {/* Brand on image */}
          <div className="relative z-10 p-8 h-full flex flex-col">
            <div className="flex flex-col leading-none mb-auto">
              <span className="font-heading text-3xl font-bold text-[#ffc589] italic" style={{fontFamily: "'Noto Serif', Georgia, serif"}}>
                Si Nonna's
              </span>
              <span className="text-[#dac2ae] text-[9px] uppercase tracking-[0.15em]">The Original Sourdough Pizza</span>
            </div>

            {/* Stats Cards at bottom */}
            <div className="flex gap-3 mt-auto">
              {[
                { label: 'NETWORK', value: '41 Stores' },
                { label: 'PRESENCE', value: '12 Cities' },
                { label: 'HERITAGE', value: 'Since 2011' },
              ].map(s => (
                <div key={s.label} className="flex-1 bg-[rgba(255,240,215,0.9)] rounded-[4px] p-3">
                  <p className="text-[#a0815a] text-[9px] uppercase tracking-widest font-medium">{s.label}</p>
                  <p className="text-[#FF9E18] font-heading font-bold text-base leading-tight">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="flex-1 bg-[#2e1b0e] p-10 flex flex-col justify-between">
          <div>
            {/* Mobile logo */}
            <div className="md:hidden mb-6 flex items-center gap-2">
              <span className="font-heading text-xl font-bold text-[#FF9E18] italic">Si Nonna's</span>
            </div>

            <p className="text-[#a0815a] text-xs uppercase tracking-[0.15em] font-medium mb-2">Staff Portal</p>
            <h1 className="font-heading text-3xl font-bold text-[#ffdbc7] mb-8">Welcome back</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-medium">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#463022] text-[#ffdbc7] border-0 border-b-2 border-[#544434] px-4 py-3 rounded-t-[2px] focus:border-[#FF9E18] focus:ring-0 focus:outline-none placeholder:text-[#544434] transition-colors"
                />
              </div>
              <div>
                <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-medium">Password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#463022] text-[#ffdbc7] border-0 border-b-2 border-[#544434] px-4 py-3 rounded-t-[2px] focus:border-[#FF9E18] focus:ring-0 focus:outline-none placeholder:text-[#544434] transition-colors pr-10"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0815a] hover:text-[#ffdbc7]">
                    <span className="material-symbols-outlined text-lg">{show ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })}
                    className="rounded border-[#544434] bg-[#463022] text-[#FF9E18] focus:ring-0" />
                  <span className="text-[#a0815a] text-xs">Remember me</span>
                </label>
                <button type="button" className="text-[#a0815a] text-xs hover:text-[#ffc589] transition-colors">
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.1em] py-3.5 rounded-[2px] hover:bg-[#ffb84d] transition-colors disabled:opacity-50 text-sm">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#544434]" />
                <span className="text-[#544434] text-xs uppercase tracking-widest">or continue as</span>
                <div className="flex-1 h-px bg-[#544434]" />
              </div>

              <Link to="/"
                className="block w-full border border-[#544434] text-[#a0815a] uppercase tracking-[0.1em] py-3 rounded-[2px] text-center text-xs font-semibold hover:border-[#a0815a] hover:text-[#ffdbc7] transition-colors">
                Browse as Guest
              </Link>
            </form>
          </div>

          <p className="text-[#544434] text-[10px] text-center mt-8">
            © 2024 Si Nonna's. Crafted for the Modern Trattoria. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
