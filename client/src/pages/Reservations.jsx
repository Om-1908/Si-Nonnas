import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/axios';
import { showToast } from '../components/Toast';
import { mockSlots } from '../lib/mockData';

export default function Reservations() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', time: '', guests: 2 });
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    api.get('/reservations/slots').then(r => setSlots(r.data.slots)).catch(() => setSlots(mockSlots.slots));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reservations', form);
      setConfirmed(true);
      showToast('Table booked successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading text-3xl font-bold text-on-surface mb-2">Reserve a Table</h1>
          <p className="text-muted mb-8">Secure your spot at our hearth. Walk-ins welcome, reservations preferred.</p>

          {confirmed ? (
            <div className="card text-center py-12 animate-fade-in">
              <span className="material-symbols-outlined text-5xl text-primary-container mb-4 block">check_circle</span>
              <h2 className="font-heading text-2xl font-bold text-on-surface mb-2">Reservation Confirmed!</h2>
              <p className="text-muted">We'll see you at Si Nonna's. A confirmation has been sent.</p>
              <button onClick={() => { setConfirmed(false); setForm({ name: '', phone: '', email: '', date: '', time: '', guests: 2 }); }} className="btn-secondary mt-6">
                Book Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" required />
                </div>
              </div>
              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">Email (optional)</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" min={tomorrow} required />
                </div>
                <div>
                  <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">Time</label>
                  <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input-field" required>
                    <option value="">Select</option>
                    {slots.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">Guests</label>
                  <select value={form.guests} onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) })} className="input-field">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Booking...' : 'Book Table'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
