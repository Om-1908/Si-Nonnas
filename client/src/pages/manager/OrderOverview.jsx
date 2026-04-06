import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { mockOrders } from '../../lib/mockData';

export default function OrderOverview() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    api.get(`/orders?${qs}`).then(r => setOrders(r.data)).catch(() => setOrders(mockOrders));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleFilter = (status) => { setFilter(status); fetchOrders(status ? { status } : {}); };

  const handleExport = () => {
    api.get('/orders/export', { responseType: 'blob' }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click();
    }).catch(() => {});
  };

  const tabs = ['', 'new', 'preparing', 'ready', 'complete', 'cancelled'];
  const tabLabels = { '': 'All', new: 'New', preparing: 'Preparing', ready: 'Ready', complete: 'Complete', cancelled: 'Cancelled' };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-on-surface">All Orders</h1>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">download</span>Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => handleFilter(t)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-all flex-shrink-0 ${filter === t ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-muted hover:text-on-surface'}`}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-2">
        {orders.map(o => (
          <div key={o._id} className="card">
            <button onClick={() => setExpanded(expanded === o._id ? null : o._id)} className="w-full flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-on-surface font-semibold text-sm">{o.orderNumber}</span>
                <span className="text-muted text-xs">{o.user?.name || 'Guest'}</span>
                <span className="text-muted text-xs">Table {o.tableNumber || '-'}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-on-surface font-semibold text-sm">₹{o.total}</span>
                <span className={`text-xs capitalize px-2 py-1 rounded-sm ${
                  o.status === 'new' ? 'bg-primary-container/15 text-primary' :
                  o.status === 'preparing' ? 'bg-yellow-900/30 text-yellow-400' :
                  o.status === 'ready' ? 'bg-green-900/30 text-green-400' :
                  o.status === 'complete' ? 'bg-surface-container-highest text-muted' : 'bg-red-900/30 text-error'
                }`}>{o.status}</span>
                <span className="text-muted text-xs">{new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </button>
            {expanded === o._id && (
              <div className="mt-4 pt-3 border-t border-outline-variant/10 animate-fade-in">
                {o.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1"><span className="text-on-surface text-sm">{item.name} × {item.qty}</span><span className="text-muted text-sm">₹{item.price * item.qty}</span></div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
