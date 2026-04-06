import { useState, useEffect } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import api from '../../lib/axios';
import { showToast } from '../../components/Toast';
import { mockOrders } from '../../lib/mockData';

function dayLabel(dateStr) {
  const d = new Date(dateStr);
  if (isToday(d)) return `Today — ${format(d, 'dd MMM yyyy')}`;
  if (isYesterday(d)) return `Yesterday — ${format(d, 'dd MMM yyyy')}`;
  return format(d, 'dd MMM yyyy');
}

function groupByDay(orders) {
  const map = {};
  orders.forEach(o => {
    const key = format(new Date(o.createdAt), 'yyyy-MM-dd');
    if (!map[key]) map[key] = { dateKey: key, dateStr: o.createdAt, orders: [] };
    map[key].orders.push(o);
  });
  // sort keys newest first
  return Object.values(map).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

function todayKey() {
  return format(new Date(), 'yyyy-MM-dd');
}

export default function OrderOverview() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null); // order detail expand
  const [openDays, setOpenDays] = useState({ [todayKey()]: true }); // today open by default

  const fetchOrders = (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    api.get(`/orders?${qs}`)
      .then(r => setOrders(r.data))
      .catch(() => setOrders(mockOrders));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleFilter = (status) => {
    setFilter(status);
    fetchOrders(status ? { status } : {});
  };

  const handleExport = () => {
    api.get('/orders/export', { responseType: 'blob' }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click();
    }).catch(() => {});
  };

  const markComplete = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'complete' });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'complete' } : o));
      showToast('Order marked complete', 'success');
    } catch { showToast('Failed to update', 'error'); }
  };

  const confirmCash = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/payment-status`, { paymentStatus: 'cash-confirmed', paymentMethod: 'cash' });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus: 'cash-confirmed' } : o));
      showToast('Cash payment confirmed!', 'success');
    } catch { showToast('Failed to confirm cash payment', 'error'); }
  };

  const toggleDay = (key) => setOpenDays(prev => ({ ...prev, [key]: !prev[key] }));

  const grouped = groupByDay(orders);

  const tabs = ['', 'new', 'preparing', 'ready', 'complete', 'cancelled'];
  const tabLabels = { '': 'All', new: 'New', preparing: 'Preparing', ready: 'Ready', complete: 'Complete', cancelled: 'Cancelled' };

  const statusBadge = (status) => {
    const map = {
      new: 'bg-[#FF9E18]/15 text-[#FF9E18]',
      preparing: 'bg-yellow-900/30 text-yellow-400',
      ready: 'bg-green-900/30 text-green-400',
      complete: 'bg-surface-container-highest text-muted',
      cancelled: 'bg-red-900/30 text-error',
    };
    return map[status] || 'bg-surface-container text-muted';
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-on-surface">All Orders</h1>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">download</span>Export CSV
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => handleFilter(t)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-all flex-shrink-0 ${filter === t ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-muted hover:text-on-surface'}`}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* Day-wise grouped sections */}
      <div className="space-y-3">
        {grouped.map(day => {
          const dayRevenue = day.orders.reduce((s, o) => s + (o.total || 0), 0);
          const isOpen = openDays[day.dateKey];
          return (
            <div key={day.dateKey} className="rounded-[4px] overflow-hidden border border-[rgba(239,159,39,0.1)]">
              {/* Day Header */}
              <button
                onClick={() => toggleDay(day.dateKey)}
                className="w-full flex items-center justify-between px-5 py-3 text-left"
                style={{ background: '#1f0d04', borderBottom: isOpen ? '1px solid rgba(239,159,39,0.2)' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#a0815a] text-base">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                  <span className="text-[#ffdbc7] font-heading font-semibold text-sm">{dayLabel(day.dateStr)}</span>
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-[#a0815a] text-xs">
                    <span className="text-[#FF9E18] font-bold">{day.orders.length}</span> orders
                  </span>
                  <span className="text-[#a0815a] text-xs">
                    Revenue: <span className="text-[#FF9E18] font-bold">₹{dayRevenue.toLocaleString('en-IN')}</span>
                  </span>
                </div>
              </button>

              {/* Day's orders */}
              {isOpen && (
                <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {day.orders.map(o => (
                    <div key={o._id}
                      className="bg-surface-container-high"
                      style={o.paymentStatus === 'cash-pending' ? { borderLeft: '3px solid #FF9E18' } : {}}
                    >
                      <button
                        onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                        className="w-full flex items-center justify-between px-5 py-3"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-on-surface font-semibold text-sm">{o.orderNumber}</span>
                          <span className="text-muted text-xs">{o.user?.name || 'Guest'}</span>
                          {o.tableNumber && <span className="text-muted text-xs">Table {o.tableNumber}</span>}
                          {/* Cash pending badge */}
                          {o.paymentStatus === 'cash-pending' && (
                            <span className="bg-[#FF9E18]/15 text-[#FF9E18] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                              💰 Cash Payment Pending
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-on-surface font-semibold text-sm">₹{o.total}</span>
                          <span className={`text-xs capitalize px-2 py-0.5 rounded-sm ${statusBadge(o.status)}`}>{o.status}</span>
                          {/* Confirm Cash button */}
                          {o.paymentStatus === 'cash-pending' && (
                            <button
                              onClick={e => { e.stopPropagation(); confirmCash(o._id); }}
                              className="bg-[#FF9E18] text-[#2c1700] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-[2px] hover:bg-[#ffb84d] transition-colors"
                            >
                              Confirm Cash
                            </button>
                          )}
                          {/* Mark Complete button for "ready" orders */}
                          {o.status === 'ready' && o.paymentStatus !== 'cash-pending' && (
                            <button
                              onClick={e => { e.stopPropagation(); markComplete(o._id); }}
                              className="bg-green-900/40 text-green-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-[2px] hover:bg-green-900/70 transition-colors"
                            >
                              Mark Complete
                            </button>
                          )}
                          <span className="text-muted text-xs">
                            {new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </button>
                      {expanded === o._id && (
                        <div className="px-5 pb-4 pt-1 border-t border-outline-variant/10 animate-fade-in">
                          {o.items.map((item, i) => (
                            <div key={i} className="flex justify-between py-1">
                              <span className="text-on-surface text-sm">{item.name} × {item.qty}</span>
                              <span className="text-muted text-sm">₹{item.price * item.qty}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {grouped.length === 0 && (
          <div className="text-center py-12 text-muted">No orders found.</div>
        )}
      </div>
    </div>
  );
}
