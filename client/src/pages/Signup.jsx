import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import api from '../lib/axios';
import { showToast } from '../components/Toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return showToast('Passwords do not match', 'error');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { name: form.name, email: form.email, password: form.password });
      setAuth(data.user, 'customer', data.token);
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-container-lowest">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-3xl font-bold text-primary-container mb-1">Si Nonna's</h1>
        <h2 className="font-heading text-xl font-semibold text-on-surface mb-1">Create your account</h2>
        <p className="text-muted text-sm mb-8">Join the sourdough revolution</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" required />
          </div>
          <div>
            <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="your@email.com" required />
          </div>
          <div>
            <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Min 6 characters" required minLength={6} />
          </div>
          <div>
            <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">Confirm Password</label>
            <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="input-field" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
