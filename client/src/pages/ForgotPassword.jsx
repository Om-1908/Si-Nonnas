import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0a02] px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <img
            src="https://sinonnas.com/wp-content/uploads/2022/06/Logo-3.png"
            alt="Si Nonna's"
            className="h-10 w-auto object-contain brightness-0 invert mx-auto"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
          />
          <span className="hidden font-heading text-2xl font-bold text-[#FF9E18] italic">Si Nonna's</span>
        </div>

        <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-2 text-center">Password Recovery</p>
        <h1 className="font-heading text-3xl font-bold text-[#ffdbc7] mb-2 text-center">Forgot Password?</h1>
        <p className="text-[#a0815a] text-sm text-center mb-8">
          Enter your email and we'll send you a reset link.
        </p>

        {sent ? (
          <div className="bg-[#2e1b0e] rounded-[4px] p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-[#FF9E18] block mb-3">mark_email_read</span>
            <p className="text-[#ffdbc7] font-semibold mb-1">Reset link sent!</p>
            <p className="text-[#a0815a] text-sm">Check your inbox. The link expires in 15 minutes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#2e1b0e] text-[#ffdbc7] border-0 border-b-2 border-[#544434] px-4 py-3 focus:border-[#FF9E18] focus:ring-0 focus:outline-none placeholder:text-[#544434] transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF9E18] text-[#2c1700] font-bold uppercase tracking-[0.12em] py-4 hover:bg-[#ffb84d] transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-[#a0815a] text-sm hover:text-[#ffc589] transition-colors">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
