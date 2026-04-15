import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset link.');
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

        <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.2em] mb-2 text-center">Security</p>
        <h1 className="font-heading text-3xl font-bold text-[#ffdbc7] mb-8 text-center">Reset Password</h1>

        {success ? (
          <div className="bg-[#2e1b0e] rounded-[4px] p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-green-400 block mb-3">check_circle</span>
            <p className="text-[#ffdbc7] font-semibold mb-1">Password reset successfully!</p>
            <p className="text-[#a0815a] text-sm">Redirecting to login…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                New Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                required
                className="w-full bg-[#2e1b0e] text-[#ffdbc7] border-0 border-b-2 border-[#544434] px-4 py-3 focus:border-[#FF9E18] focus:ring-0 focus:outline-none placeholder:text-[#544434] transition-colors"
              />
            </div>

            <div>
              <label className="text-[#a0815a] text-[10px] uppercase tracking-widest mb-2 block font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat password"
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
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
