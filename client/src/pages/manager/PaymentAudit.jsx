import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { mockPayments } from '../../lib/mockData';

export default function PaymentAudit() {
  const [payments, setPayments] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/payments').then(r => setPayments(r.data)).catch(() => setPayments(mockPayments));
  }, []);

  const handleExport = () => {
    api.get('/payments/export', { responseType: 'blob' }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click();
    }).catch(() => {});
  };

  const statusColors = { captured: 'bg-green-900/30 text-green-400', created: 'bg-yellow-900/30 text-yellow-400', failed: 'bg-red-900/30 text-error' };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-on-surface">Payment Audit</h1>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">download</span>Export CSV
        </button>
      </div>

      <div className="space-y-2">
        {payments.map(p => (
          <div key={p._id} className="card">
            <button onClick={() => setExpanded(expanded === p._id ? null : p._id)} className="w-full flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-on-surface font-semibold text-sm">{p.order?.orderNumber || 'N/A'}</span>
                <span className={`text-xs capitalize px-2 py-0.5 rounded-sm ${statusColors[p.status]}`}>{p.status}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-on-surface font-semibold text-sm">₹{p.amount.toLocaleString('en-IN')}</span>
                <span className="text-muted text-xs">{new Date(p.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </button>
            {expanded === p._id && (
              <div className="mt-4 pt-3 border-t border-outline-variant/10 animate-fade-in text-sm space-y-1">
                <p><span className="text-muted">Razorpay Order:</span> <span className="text-on-surface">{p.razorpayOrderId || '—'}</span></p>
                <p><span className="text-muted">Payment ID:</span> <span className="text-on-surface">{p.razorpayPaymentId || '—'}</span></p>
                <p><span className="text-muted">Currency:</span> <span className="text-on-surface">{p.currency}</span></p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
