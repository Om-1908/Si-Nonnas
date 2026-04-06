import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { mockAnalyticsSummary, mockOrders, mockReviews } from '../../lib/mockData';
import { showToast } from '../../components/Toast';

export default function Dashboard() {
  const [summary, setSummary] = useState(mockAnalyticsSummary);
  const [activeOrders, setActiveOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const now = new Date();

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data)).catch(() => {});
    api.get('/orders?status=new,preparing,ready&limit=6')
      .then(r => setActiveOrders(r.data))
      .catch(() => setActiveOrders(mockOrders.slice(0, 3)));
    api.get('/reviews?limit=3')
      .then(r => setReviews(r.data))
      .catch(() => setReviews(mockReviews));
  }, []);

  const kpis = [
    {
      label: "Today's Revenue",
      value: `₹${(summary.todayRevenue || 142500).toLocaleString('en-IN')}`,
      change: '+16%',
      positive: true,
      key: 'revenue',
    },
    {
      label: 'Active Orders',
      value: summary.activeOrders || 12,
      sub: 'Full Haus',
      key: 'orders',
    },
    {
      label: 'Pending Reservations',
      value: summary.pendingReservations || 8,
      sub: 'Dinner Service',
      key: 'reservations',
    },
    {
      label: 'Low Stock',
      value: summary.lowStockAlerts || 3,
      sub: 'Alerts',
      alert: true,
      key: 'stock',
    },
  ];

  const quickActions = [
    { icon: 'add_circle', label: 'Add Menu Item', to: '/manager/menu' },
    { icon: 'calendar_month', label: 'Reservations', to: '/manager/reservations' },
    { icon: 'download', label: 'Export Report', action: 'export' },
    { icon: 'inventory_2', label: 'Inventory', to: '/manager/menu' },
  ];

  const handleReply = async (id) => {
    try {
      await api.post(`/reviews/${id}/reply`, { message: replyText });
      setReplyId(null); setReplyText('');
      showToast('Reply sent', 'success');
    } catch { showToast('Failed', 'error'); }
  };

  const lowStockItems = [
    { name: 'Buffalo Mozzarella', stock: '2kg', threshold: '5kg', pct: 40 },
    { name: 'San Marzano Tomatoes', stock: '5 Cans', threshold: '12 Cans', pct: 41 },
    { name: 'Artisan Flour (Type 00)', stock: '4kg', threshold: '10kg', pct: 40 },
  ];

  const staffOnShift = [
    { name: 'Marco L.', role: 'Head Chef', status: 'Active since 9:30 AM', color: 'bg-amber-500' },
    { name: 'Sonia P.', role: 'Floor Lead', status: 'Active since 12:00 PM', color: 'bg-green-600' },
    { name: 'Rahul J.', role: 'Sommelier', status: 'Starts at 4 PM', color: 'bg-blue-600' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#ffdbc7]">{greeting}, Chef</h1>
          <p className="text-[#a0815a] text-sm italic mt-1">Everything is proofing perfectly in the digital trattoria.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[#a0815a] text-[9px] uppercase tracking-widest">Current Shift</p>
            <p className="text-[#ffdbc7] font-mono text-sm font-semibold">12:30 PM — 11:00 PM</p>
          </div>
          <button className="w-9 h-9 bg-[#3a2518] rounded-full flex items-center justify-center text-[#a0815a] hover:text-[#ffdbc7] relative">
            <span className="material-symbols-outlined text-lg">notifications</span>
            {(summary.lowStockAlerts || 3) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {summary.lowStockAlerts || 3}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.key} className="bg-[#2e1b0e] rounded-[4px] p-4 border-t-2 border-transparent hover:border-[#FF9E18] transition-colors">
                <p className="text-[#a0815a] text-[9px] uppercase tracking-[0.15em] mb-2">{k.label}</p>
                <div className="flex items-end gap-2">
                  <span className="font-heading text-2xl font-bold text-[#ffdbc7]">{k.value}</span>
                  {k.change && <span className="text-green-400 text-xs font-semibold mb-0.5">{k.change}</span>}
                  {k.alert && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-[2px] bg-red-900/50 text-red-400 mb-0.5">{k.sub}</span>
                  )}
                </div>
                {k.sub && !k.alert && <p className="text-[#a0815a] text-xs mt-1">{k.sub}</p>}
              </div>
            ))}
          </div>

          {/* Active Orders */}
          <div className="bg-[#2e1b0e] rounded-[4px] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-[#ffdbc7] font-semibold">Active orders right now</h2>
              <a href="/manager/orders" className="text-[#FF9E18] text-xs hover:underline">View All</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeOrders.slice(0, 3).map(order => (
                <div key={order._id} className="bg-[#3a2518] rounded-[4px] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-[2px] ${
                      order.status === 'new' ? 'bg-[#FF9E18]/20 text-[#FF9E18]' :
                      order.status === 'preparing' ? 'bg-yellow-900/40 text-yellow-400' :
                      'bg-green-900/40 text-green-400'
                    }`}>
                      {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeaway'}
                    </span>
                    <span className="text-[#a0815a] text-[10px]">{Math.floor((Date.now() - new Date(order.createdAt)) / 60000)} min</span>
                  </div>
                  <p className="text-[#ffdbc7] font-semibold text-xs mb-1">{order.items.length} items</p>
                  <p className="text-[#a0815a] text-[10px] leading-relaxed line-clamp-2">
                    {order.items.map(i => i.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#2e1b0e] rounded-[4px] p-5">
            <h2 className="font-heading text-[#ffdbc7] font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-4">
              {quickActions.map(a => (
                <a key={a.label} href={a.to || '#'}
                  className="flex flex-col items-center gap-2 bg-[#3a2518] rounded-[4px] p-4 hover:bg-[#463022] transition-colors group">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
                    a.label.includes('Add') ? 'bg-[#FF9E18]/20' :
                    a.label.includes('Reserve') ? 'bg-blue-900/40' :
                    a.label.includes('Export') ? 'bg-green-900/40' : 'bg-purple-900/40'
                  }`}>
                    <span className={`material-symbols-outlined text-lg ${
                      a.label.includes('Add') ? 'text-[#FF9E18]' :
                      a.label.includes('Reserve') ? 'text-blue-400' :
                      a.label.includes('Export') ? 'text-green-400' : 'text-purple-400'
                    }`}>{a.icon}</span>
                  </span>
                  <span className="text-[#a0815a] text-[10px] text-center leading-tight">{a.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-[#2e1b0e] rounded-[4px] p-5">
            <h2 className="font-heading text-[#ffdbc7] font-semibold mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r._id} className="pb-4 border-b border-[#463022] last:border-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[#FF9E18] text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span className="text-[#ffdbc7] text-xs font-medium">{r.user?.name || 'Guest'}</span>
                    </div>
                    <span className="text-[#544434] text-[10px]">{new Date(r.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[#dac2ae] text-sm italic mb-2">"{r.comment}"</p>
                  {replyId === r._id ? (
                    <div>
                      <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                        className="w-full bg-[#3a2518] text-[#ffdbc7] text-xs px-3 py-2 rounded-[2px] border border-[#463022] resize-none h-16 focus:outline-none focus:border-[#FF9E18] mb-2" placeholder="Write a reply..." />
                      <div className="flex gap-2">
                        <button onClick={() => handleReply(r._id)} className="bg-[#FF9E18] text-[#2c1700] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-[2px]">Send</button>
                        <button onClick={() => setReplyId(null)} className="text-[#a0815a] text-[10px] px-3 py-1.5">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setReplyId(r._id); setReplyText(''); }}
                      className="border border-[#463022] text-[#a0815a] text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-[2px] hover:border-[#a0815a] hover:text-[#ffdbc7] transition-colors">
                      Reply
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Alerts Column */}
        <div className="w-64 flex-shrink-0 hidden xl:block space-y-4">

          {/* Alerts & Stock */}
          <div className="bg-[#2e1b0e] rounded-[4px] p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-yellow-400 text-lg">warning</span>
              <h3 className="text-[#ffdbc7] font-semibold text-sm">Alerts & Stock</h3>
            </div>
            <p className="text-[#a0815a] text-[9px] uppercase tracking-widest mb-3">Critical Low Stock</p>
            <div className="space-y-3">
              {lowStockItems.map(s => (
                <div key={s.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#ffdbc7] text-xs">{s.name}</span>
                    <span className="text-red-400 text-xs font-bold">{s.stock}</span>
                  </div>
                  <div className="h-1 bg-[#463022] rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#544434] text-[9px]">Threshold: {s.threshold}</span>
                    <button className="text-[#FF9E18] text-[9px] uppercase tracking-wider hover:underline">Update Stock</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff on Shift */}
          <div className="bg-[#2e1b0e] rounded-[4px] p-4">
            <p className="text-[#a0815a] text-[9px] uppercase tracking-widest mb-3">Staff on Shift</p>
            <div className="space-y-3">
              {staffOnShift.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${s.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                    {s.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#ffdbc7] text-xs font-medium truncate">{s.name}</p>
                    <p className="text-[#a0815a] text-[9px]">{s.role}</p>
                    <p className="text-[#544434] text-[9px] truncate">{s.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manager's Insight */}
          <div className="bg-[#2e1b0e] rounded-[4px] p-4">
            <p className="text-[#a0815a] text-[9px] uppercase tracking-widest mb-3">Manager's Insight</p>
            <p className="text-[#a0815a] text-xs italic leading-relaxed">
              "Dinner traffic is projected to be 20% higher than last Tuesday. Suggest prepping extra dough batches by 4:00 PM."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
