import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import api from '../lib/axios';
import { showToast } from '../components/Toast';

const INPUT_CLS = 'w-full bg-[#2e1b0e] text-[#ffdbc7] border-0 border-b-2 border-[#544434] px-4 py-3 focus:border-[#FF9E18] focus:ring-0 focus:outline-none placeholder:text-[#544434] transition-colors';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);

  // Mode toggle
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  // Login state
  const [login, setLogin] = useState({ email: '', password: '', remember: false });
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [signup, setSignup] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupErrors, setSignupErrors] = useState({});
  const [signupBanner, setSignupBanner] = useState('');

  // ── Login submit ──────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email: login.email, password: login.password });
      setAuth(data.user, data.role, data.token);
      if (data.role === 'manager') navigate('/manager');
      else if (data.role === 'kitchen_staff') navigate('/kitchen');
      else navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Signup validation ─────────────────────────────────────
  const validateSignup = () => {
    const errs = {};
    if (!signup.name.trim() || signup.name.trim().length < 2)
      errs.name = 'Full name must be at least 2 characters.';
    if (!signup.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signup.email))
      errs.email = 'Please enter a valid email address.';
    if (!signup.password || signup.password.length < 8)
      errs.password = 'Password must be at least 8 characters.';
    if (signup.confirm !== signup.password)
      errs.confirm = 'Passwords do not match.';
    return errs;
  };

  // ── Signup submit ─────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupBanner('');
    const errs = validateSignup();
    if (Object.keys(errs).length > 0) { setSignupErrors(errs); return; }
    setSignupErrors({});
    setSignupLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        name: signup.name.trim(),
        email: signup.email.trim(),
        password: signup.password,
      });
      setAuth(data.user, data.role, data.token);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('already')) {
        setSignupBanner('An account with this email already exists. Please sign in.');
      } else {
        setSignupBanner(msg || 'Registration failed. Please try again.');
      }
    } finally {
      setSignupLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setSignupErrors({});
    setSignupBanner('');
  };

  return (
    <div className="flex flex-col md:flex-row w-screen min-h-screen overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="relative flex-shrink-0 h-[120px] md:h-auto md:w-[75vw] overflow-hidden">
        <img
          src="https://b.zmtcdn.com/data/pictures/7/20906977/e12a7f8d35e6f3dcb1e55ad59296a01f.jpeg?fit=around|960:500&crop=960:500;*,*"
          alt="Pizza oven"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,10,2,0.90)] via-[rgba(26,10,2,0.35)] to-[rgba(255,158,24,0.12)]" />
        <div className="relative z-10 h-full flex flex-col px-10 py-8">
          <div className="flex flex-col leading-none">
            <img
              src="https://sinonnas.com/wp-content/uploads/2022/06/Logo-3.png"
              alt="Si Nonna's"
              className="h-[200px] w-auto object-contain brightness-0 invert"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
            <span className="hidden font-heading text-2xl font-bold text-[#ffc589] italic" style={{ fontFamily: "'Noto Serif',Georgia,serif" }}>
              Si Nonna's
            </span>
          </div>
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

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 md:w-[35vw] bg-[#1a0a02] flex flex-col justify-between px-8 py-8 md:py-10 overflow-y-auto">
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

          <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.18em] font-semibold mb-2">
            {mode === 'login' ? 'Customer Portal' : 'Create Account'}
          </p>
          <h1 className="font-heading text-4xl font-bold text-[#ffdbc7] mb-8">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>

          {/* ════ LOGIN FORM ════ */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6 max-w-sm">
              <div>
                <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  value={login.email}
                  onChange={e => setLogin({ ...login, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPw ? 'text' : 'password'}
                    value={login.password}
                    onChange={e => setLogin({ ...login, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className={`${INPUT_CLS} pr-10`}
                  />
                  <button type="button" onClick={() => setShowLoginPw(!showLoginPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0815a] hover:text-[#ffdbc7] transition-colors">
                    <span className="material-symbols-outlined text-lg">{showLoginPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={login.remember}
                    onChange={e => setLogin({ ...login, remember: e.target.checked })}
                    className="rounded border-[#544434] bg-[#2e1b0e] text-[#FF9E18] focus:ring-0" />
                  <span className="text-[#a0815a] text-xs">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-[#a0815a] text-xs hover:text-[#ffc589] transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loginLoading}
                className="w-full bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.12em] py-4 hover:bg-[#ffb84d] transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                {loginLoading && <span className="w-4 h-4 border-2 border-[#2c1700] border-t-transparent rounded-full animate-spin" />}
                {loginLoading ? 'Signing in…' : 'Sign In'}
              </button>

              {/* Sign up prompt */}
              <p className="text-[#a0815a] text-sm text-center">
                New here?{' '}
                <button type="button" onClick={() => switchMode('signup')}
                  className="text-[#FF9E18] font-semibold hover:text-[#ffb84d] transition-colors">
                  Create an account
                </button>
              </p>

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
          )}

          {/* ════ SIGNUP FORM ════ */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-5 max-w-sm">

              {/* Error banner */}
              {signupBanner && (
                <div className="bg-red-950/60 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-[4px]">
                  {signupBanner}
                </div>
              )}

              {/* Full name */}
              <div>
                <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  value={signup.name}
                  onChange={e => { setSignup({ ...signup, name: e.target.value }); setSignupErrors({ ...signupErrors, name: '' }); }}
                  placeholder="Your full name"
                  className={INPUT_CLS}
                />
                {signupErrors.name && <p className="text-[#ef4444] text-xs mt-1">{signupErrors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  value={signup.email}
                  onChange={e => { setSignup({ ...signup, email: e.target.value }); setSignupErrors({ ...signupErrors, email: '' }); }}
                  placeholder="your@email.com"
                  className={INPUT_CLS}
                />
                {signupErrors.email && <p className="text-[#ef4444] text-xs mt-1">{signupErrors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showSignupPw ? 'text' : 'password'}
                    value={signup.password}
                    onChange={e => { setSignup({ ...signup, password: e.target.value }); setSignupErrors({ ...signupErrors, password: '' }); }}
                    placeholder="Min. 8 characters"
                    className={`${INPUT_CLS} pr-10`}
                  />
                  <button type="button" onClick={() => setShowSignupPw(!showSignupPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0815a] hover:text-[#ffdbc7] transition-colors">
                    <span className="material-symbols-outlined text-lg">{showSignupPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {signupErrors.password && <p className="text-[#ef4444] text-xs mt-1">{signupErrors.password}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={signup.confirm}
                    onChange={e => { setSignup({ ...signup, confirm: e.target.value }); setSignupErrors({ ...signupErrors, confirm: '' }); }}
                    placeholder="Repeat password"
                    className={`${INPUT_CLS} pr-10`}
                  />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0815a] hover:text-[#ffdbc7] transition-colors">
                    <span className="material-symbols-outlined text-lg">{showConfirmPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {signupErrors.confirm && <p className="text-[#ef4444] text-xs mt-1">{signupErrors.confirm}</p>}
              </div>

              <button type="submit" disabled={signupLoading}
                className="w-full bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.12em] py-4 hover:bg-[#ffb84d] transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                {signupLoading && <span className="w-4 h-4 border-2 border-[#2c1700] border-t-transparent rounded-full animate-spin" />}
                {signupLoading ? 'Creating account…' : 'Create Account'}
              </button>

              {/* Switch to login */}
              <p className="text-[#a0815a] text-sm text-center">
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('login')}
                  className="text-[#FF9E18] font-semibold hover:text-[#ffb84d] transition-colors">
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="text-[#2e1b0e] text-[10px] text-center mt-10 select-none">
          © 2024 Si Nonna's. Crafted for the Modern Trattoria. All rights reserved.
        </p>
      </div>
    </div>
  );
}
