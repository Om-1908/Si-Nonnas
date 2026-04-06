import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { showToast } from '../../components/Toast';
import { mockReservations } from '../../lib/mockData';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('');

  const fetch = (status = '') => {
    const qs = status ? `?status=${status}` : '';
    api.get(`/reservations${qs}`).then(r => setReservations(r.data)).catch(() => setReservations(mockReservations));
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/reservations/${id}`, { status });
      fetch(filter);
      showToast(`Reservation ${status}`, 'success');
    } catch { showToast('Failed to update', 'error'); }
  };

  const statusColors = { pending: 'bg-yellow-900/30 text-yellow-400', confirmed: 'bg-green-900/30 text-green-400', cancelled: 'bg-red-900/30 text-error' };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <h1 className="font-heading text-2xl font-bold text-on-surface mb-6">Reservations</h1>

      <div className="flex gap-2 mb-6">
        {['', 'pending', 'confirmed', 'cancelled'].map(s => (
          <button key={s} onClick={() => { setFilter(s); fetch(s); }}
            className={`px-4 py-2 rounded-sm text-sm font-medium ${filter === s ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-muted hover:text-on-surface'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {reservations.map(r => (
          <div key={r._id} className="card flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-on-surface font-medium text-sm">{r.name}</h3>
                <span className={`text-xs capitalize px-2 py-0.5 rounded-sm ${statusColors[r.status]}`}>{r.status}</span>
              </div>
              <p className="text-muted text-xs mt-1">
                {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {r.time} · {r.guests} guests · {r.phone}
              </p>
            </div>
            {r.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => updateStatus(r._id, 'confirmed')} className="text-xs px-3 py-1.5 rounded-sm bg-green-900/30 text-green-400 hover:bg-green-900/50">Confirm</button>
                <button onClick={() => updateStatus(r._id, 'cancelled')} className="text-xs px-3 py-1.5 rounded-sm bg-red-900/30 text-error hover:bg-red-900/50">Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
