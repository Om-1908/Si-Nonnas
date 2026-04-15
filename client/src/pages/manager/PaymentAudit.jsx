import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import socket from '../../lib/socket';

const STATUS_COLORS = {
  captured:         'bg-green-900/30 text-green-400',
  paid:             'bg-green-900/30 text-green-400',
  'cash-confirmed': 'bg-green-900/30 text-green-400',
  'upi-confirmed':  'bg-green-900/30 text-green-400',
  'cash-pending':   'bg-yellow-900/30 text-yellow-400',
  'upi-pending':    'bg-blue-900/20 text-blue-400',
  created:          'bg-yellow-900/30 text-yellow-400',
  pending:          'bg-yellow-900/30 text-yellow-400',
  failed:           'bg-red-900/30 text-red-400',
};

const METHOD_COLORS = {
  upi:  'bg-purple-900/30 text-purple-300',
  cash: 'bg-amber-900/30 text-amber-400',
  card: 'bg-blue-900/30 text-blue-300',
};

const shortId = (id) => id ? String(id).slice(-8).toUpperCase() : '—';
const formatDate = (d) => new Date(d).toLocaleString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});
const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();

export default function PaymentAudit() {
  const [payments, setPayments]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [filter, setFilter]         = useState('all');    // all | upi | cash | card
  const [statusFilter, setStatusFilter] = useState('all'); // all | pending | confirmed | failed
  const [newIds, setNewIds]         = useState(new Set());

  // Fetch from /api/orders (which has paymentStatus & paymentMethod embedded)
  const fetchPayments = () => {
    setLoading(true);
    setError(false);
    api.get('/orders')
      .then(r => { setPayments(r.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => {
    fetchPayments();

    socket.connect();
    socket.on('payment-upi-confirmed', (data) => {
      setNewIds(prev => new Set([...prev, data.orderId]));
      setTimeout(() => {
        setNewIds(prev => { const n = new Set(prev); n.delete(data.orderId); return n; });
      }, 3000);
      fetchPayments();
    });
    return () => {
      socket.off('payment-upi-confirmed');
      socket.disconnect();
    };
  }, []);

  const handleExport = () => {
    api.get('/orders/export', { responseType: 'blob' }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click();
    }).catch(() => {});
  };

  // ── Summary calculations from real data ──────────────────
  const todayOrders    = payments.filter(o => isToday(o.createdAt));
  const confirmedToday = todayOrders.filter(o =>
    ['cash-confirmed', 'upi-confirmed', 'captured', 'paid'].includes(o.paymentStatus)
  );
  const totalToday  = confirmedToday.reduce((s, o) => s + (o.total || 0), 0);
  const upiToday    = confirmedToday.filter(o => o.paymentMethod === 'upi').reduce((s, o) => s + (o.total || 0), 0);
  const cashToday   = confirmedToday.filter(o => o.paymentMethod === 'cash').reduce((s, o) => s + (o.total || 0), 0);

  const summaryCards = [
    { label: "Total Collected Today",  value: `₹${totalToday.toLocaleString('en-IN')}`,  icon: 'payments',        color: 'text-[#FF9E18]' },
    { label: "UPI / Online",           value: `₹${upiToday.toLocaleString('en-IN')}`,    icon: 'phone_iphone',    color: 'text-purple-400' },
    { label: "Cash",                   value: `₹${cashToday.toLocaleString('en-IN')}`,   icon: 'currency_rupee',  color: 'text-amber-400' },
  ];

  // ── Client-side filtering ─────────────────────────────────
  const filtered = payments.filter(o => {
    const methodOk = filter === 'all' || o.paymentMethod === filter;
    const statusOk =
      statusFilter === 'all' ? true :
      statusFilter === 'pending'   ? ['cash-pending','upi-pending','pending','created'].includes(o.paymentStatus) :
      statusFilter === 'confirmed' ? ['cash-confirmed','upi-confirmed','captured','paid'].includes(o.paymentStatus) :
      statusFilter === 'failed'    ? o.paymentStatus === 'failed' : true;
    return methodOk && statusOk;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#ffdbc7]">Payment Audit</h1>
        <button onClick={handleExport}
          className="flex items-center gap-2 text-sm border border-[#463022] text-[#a0815a] px-4 py-2 rounded-[4px] hover:border-[#a0815a] hover:text-[#ffdbc7] transition-colors">
          <span className="material-symbols-outlined text-lg">download</span>Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {summaryCards.map(c => (
          <div key={c.label} className="bg-[#2e1b0e] rounded-[4px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`material-symbols-outlined text-lg ${c.color}`}>{c.icon}</span>
              <p className="text-[#a0815a] text-[10px] uppercase tracking-[0.15em] font-semibold">{c.label}</p>
            </div>
            <p className={`font-heading text-2xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Method filter */}
        {['all','upi','cash','card'].map(m => (
          <button key={m} onClick={() => setFilter(m)}
            className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-[2px] transition-colors ${
              filter === m ? 'bg-[#FF9E18] text-[#2c1700]' : 'bg-[#2e1b0e] text-[#a0815a] hover:text-[#ffdbc7]'
            }`}>
            {m === 'all' ? 'All Methods' : m.toUpperCase()}
          </button>
        ))}
        <div className="w-px bg-[#463022] mx-1" />
        {/* Status filter */}
        {['all','pending','confirmed','failed'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-[2px] transition-colors ${
              statusFilter === s ? 'bg-[#3a2518] text-[#ffdbc7] border border-[#FF9E18]' : 'bg-[#2e1b0e] text-[#a0815a] hover:text-[#ffdbc7]'
            }`}>
            {s === 'all' ? 'All Status' : s}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-[#FF9E18] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-3xl text-red-400 mb-2 block">error</span>
          <p className="text-red-400 text-sm">Failed to load transactions. Please refresh.</p>
          <button onClick={fetchPayments}
            className="mt-4 text-[#FF9E18] text-xs uppercase tracking-widest hover:underline">
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-3xl text-[#463022] mb-2 block">receipt_long</span>
          <p className="text-[#544434] text-sm">No transactions yet.</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="bg-[#2e1b0e] rounded-[4px] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-7 gap-2 px-4 py-2.5 border-b border-[#463022]">
            {['Transaction ID','Order #','Table #','Amount','Method','Status','Date & Time'].map(h => (
              <p key={h} className="text-[#a0815a] text-[9px] uppercase tracking-[0.15em] font-semibold">{h}</p>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#3a2518]">
            {filtered.map(o => (
              <div
                key={o._id}
                className={`grid grid-cols-7 gap-2 px-4 py-3 items-center transition-colors hover:bg-[#3a2518] ${
                  newIds.has(o._id) ? 'border-l-2 border-[#FF9E18]' : ''
                }`}
              >
                {/* Transaction ID */}
                <span className="text-[#ffdbc7] text-xs font-mono">
                  #{shortId(o._id)}
                  {newIds.has(o._id) && (
                    <span className="ml-1 text-[#FF9E18] text-[9px] font-bold uppercase animate-pulse">NEW</span>
                  )}
                </span>

                {/* Order # */}
                <span className="text-[#a0815a] text-xs">
                  {o.orderNumber || shortId(o._id)}
                </span>

                {/* Table # */}
                <span className="text-[#a0815a] text-xs">
                  {o.tableNumber ? `Table ${o.tableNumber}` : <span className="text-[#544434]">Takeaway</span>}
                </span>

                {/* Amount */}
                <span className="text-[#FF9E18] font-heading font-bold text-sm">
                  ₹{(o.total || 0).toLocaleString('en-IN')}
                </span>

                {/* Method */}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm w-fit ${
                  METHOD_COLORS[o.paymentMethod] || 'bg-[#3a2518] text-[#a0815a]'
                }`}>
                  {o.paymentMethod || '—'}
                </span>

                {/* Status */}
                <span className={`text-[10px] font-bold capitalize px-2 py-0.5 rounded-sm w-fit ${
                  STATUS_COLORS[o.paymentStatus] || 'bg-[#3a2518] text-[#a0815a]'
                }`}>
                  {o.paymentStatus?.replace('-', ' ') || '—'}
                </span>

                {/* Date */}
                <span className="text-[#544434] text-[10px]">
                  {formatDate(o.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
