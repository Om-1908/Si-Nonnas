import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import socket from '../../lib/socket';
import { mockPayments } from '../../lib/mockData';

export default function PaymentAudit() {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(null);
  const [newIds, setNewIds] = useState(new Set());

  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await api.get('/payments');
      return res.data;
    },
    placeholderData: mockPayments,
  });

  // Socket.io real-time listener
  useEffect(() => {
    socket.connect();
    socket.on('payment-captured', (payment) => {
      setNewIds(prev => new Set([...prev, payment._id]));
      setTimeout(() => {
        setNewIds(prev => {
          const next = new Set(prev);
          next.delete(payment._id);
          return next;
        });
      }, 2000);
      queryClient.invalidateQueries(['payments']);
    });
    return () => {
      socket.off('payment-captured');
      socket.disconnect();
    };
  }, [queryClient]);

  const handleExport = () => {
    api.get('/payments/export', { responseType: 'blob' }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click();
    }).catch(() => {});
  };

  const statusColors = {
    captured: 'bg-green-900/30 text-green-400',
    paid: 'bg-green-900/30 text-green-400',
    'cash-confirmed': 'bg-green-900/30 text-green-400',
    'cash-pending': 'bg-yellow-900/30 text-yellow-400',
    created: 'bg-yellow-900/30 text-yellow-400',
    pending: 'bg-yellow-900/30 text-yellow-400',
    failed: 'bg-red-900/30 text-error',
  };

  const shortId = (id) => id ? String(id).slice(-8) : '—';

  const formatDate = (d) => new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-on-surface">Payment Audit</h1>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">download</span>Export CSV
        </button>
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <span className="inline-block w-8 h-8 border-2 border-[#FF9E18] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-16">
          <p className="text-error text-sm">Unable to load payments. Check your connection.</p>
        </div>
      )}

      {!isLoading && !error && payments.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#a0815a] text-sm">No payments recorded yet.</p>
        </div>
      )}

      {!isLoading && !error && payments.length > 0 && (
        <div className="space-y-2">
          {payments.map(p => (
            <div
              key={p._id}
              className="card transition-all duration-300"
              style={newIds.has(p._id) ? { border: '1px solid rgba(255,158,24,0.7)', boxShadow: '0 0 8px rgba(255,158,24,0.2)' } : {}}
            >
              <button
                onClick={() => setExpanded(expanded === p._id ? null : p._id)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-on-surface font-semibold text-sm font-mono">
                    #{shortId(p.razorpayPaymentId || p._id)}
                  </span>
                  <span className="text-muted text-xs">{p.order?.orderNumber || 'N/A'}</span>
                  {/* Order type badge */}
                  {p.order?.orderType && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                      p.order.orderType === 'dine-in' ? 'bg-[#FF9E18]/15 text-[#FF9E18]' : 'bg-blue-900/30 text-blue-400'
                    }`}>
                      {p.order.orderType}
                    </span>
                  )}
                  <span className={`text-xs capitalize px-2 py-0.5 rounded-sm ${statusColors[p.status] || 'bg-surface-container text-muted'}`}>
                    {p.status}
                  </span>
                  {newIds.has(p._id) && (
                    <span className="text-[#FF9E18] text-[10px] font-bold uppercase tracking-wider animate-pulse">New</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#FF9E18] font-heading font-bold text-sm">
                    ₹{p.amount?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-muted text-xs">{formatDate(p.createdAt)}</span>
                </div>
              </button>

              {expanded === p._id && (
                <div className="mt-4 pt-3 border-t border-outline-variant/10 animate-fade-in text-sm space-y-1">
                  <p><span className="text-muted">Order:</span> <span className="text-on-surface">{p.order?.orderNumber || '—'}</span></p>
                  {p.order?.tableNumber && <p><span className="text-muted">Table:</span> <span className="text-on-surface">{p.order.tableNumber}</span></p>}
                  <p><span className="text-muted">Payment Ref:</span> <span className="text-on-surface font-mono text-xs">{p.razorpayPaymentId || p._id}</span></p>
                  <p><span className="text-muted">Currency:</span> <span className="text-on-surface">{p.currency || 'INR'}</span></p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
