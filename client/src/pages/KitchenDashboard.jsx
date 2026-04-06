import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import api from '../lib/axios';
import socket from '../lib/socket';
import { showToast } from '../components/Toast';

export default function KitchenDashboard() {
  const { user, clear } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState({ new: [], preparing: [], ready: [] });
  const [doneCount, setDoneCount] = useState(0);
  const [clock, setClock] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(new Set()); // IDs being updated

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const groupOrders = useCallback((list) => {
    setOrders({
      new: list.filter(o => o.status === 'new'),
      preparing: list.filter(o => o.status === 'preparing'),
      ready: list.filter(o => o.status === 'ready'),
    });
  }, []);

  // Fetch active orders from server — no mock fallback
  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/orders?status=new,preparing,ready&limit=100');
      groupOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      // If 401, axios interceptor handles redirect. Otherwise show error, start with empty board.
      if (err.response?.status !== 401) {
        showToast('Could not load orders — retrying...', 'error');
      }
      setOrders({ new: [], preparing: [], ready: [] });
    } finally {
      setLoading(false);
    }
  }, [groupOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Socket — join kitchen room, listen for new orders
  useEffect(() => {
    socket.connect();
    socket.emit('join', 'kitchen');

    socket.on('connect', () => {
      // Re-join room after reconnection
      socket.emit('join', 'kitchen');
    });

    socket.on('new-order', (order) => {
      // Flash highlight new order for 2s then clear
      setOrders(prev => ({
        ...prev,
        new: [{ ...order, _flash: true }, ...prev.new.filter(o => o._id !== order._id)],
      }));
      setTimeout(() => {
        setOrders(prev => ({
          ...prev,
          new: prev.new.map(o => o._id === order._id ? { ...o, _flash: false } : o),
        }));
      }, 2000);
    });

    // Listen for status changes from other sessions (manager also changing status)
    socket.on('order-status-change', ({ orderId, status }) => {
      setOrders(prev => {
        const allOrders = [...prev.new, ...prev.preparing, ...prev.ready];
        const changed = allOrders.find(o => o._id === orderId);
        if (!changed) return prev;
        const next = { new: prev.new, preparing: prev.preparing, ready: prev.ready };
        // Remove from all columns
        next.new = next.new.filter(o => o._id !== orderId);
        next.preparing = next.preparing.filter(o => o._id !== orderId);
        next.ready = next.ready.filter(o => o._id !== orderId);
        // Add to correct column (complete removes it entirely)
        if (status === 'new') next.new = [{ ...changed, status }, ...next.new];
        else if (status === 'preparing') next.preparing = [...next.preparing, { ...changed, status }];
        else if (status === 'ready') next.ready = [...next.ready, { ...changed, status }];
        else if (status === 'complete') setDoneCount(c => c + 1);
        return next;
      });
    });

    return () => {
      socket.off('new-order');
      socket.off('order-status-change');
      socket.off('connect');
      socket.disconnect();
    };
  }, []);

  // Update order status — optimistic UI + API call
  const updateStatus = async (id, from, to) => {
    if (updating.has(id)) return; // prevent double-tap
    setUpdating(prev => new Set([...prev, id]));

    // Optimistic update
    setOrders(prev => {
      const order = prev[from]?.find(o => o._id === id);
      if (!order) return prev;
      const next = { ...prev };
      next[from] = prev[from].filter(o => o._id !== id);
      if (to === 'complete') {
        setDoneCount(c => c + 1);
      } else {
        next[to] = [...prev[to], { ...order, status: to }];
      }
      return next;
    });

    try {
      await api.patch(`/orders/${id}/status`, { status: to });
    } catch {
      showToast('Failed to update — refreshing...', 'error');
      // Rollback by re-fetching
      fetchOrders();
    } finally {
      setUpdating(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleLogout = () => { clear(); navigate('/login'); };
  const getMinutesAgo = (date) => Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  const totalActive = orders.new.length + orders.preparing.length + orders.ready.length;

  const columns = [
    {
      key: 'new',
      label: 'New Orders',
      color: 'text-[#FF9E18]',
      emptyMsg: 'No new orders',
      btn: { label: 'Start Preparing', next: 'preparing' },
      btnStyle: 'bg-[#FF9E18]/15 text-[#FF9E18] hover:bg-[#FF9E18]/30',
    },
    {
      key: 'preparing',
      label: 'Preparing',
      color: 'text-yellow-400',
      emptyMsg: 'Nothing in preparation',
      btn: { label: 'Mark Ready', next: 'ready' },
      btnStyle: 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50',
    },
    {
      key: 'ready',
      label: 'Ready to Serve',
      color: 'text-green-400',
      emptyMsg: 'No orders ready yet',
      btn: null, // Kitchen doesn't complete — manager does
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-surface-container-lowest overflow-hidden">

      {/* Top Bar */}
      <header className="bg-surface-container border-b border-outline-variant/10 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-lg font-bold text-[#FF9E18] uppercase tracking-wider">
            Si Nonna's Kitchen
          </h1>
          <span className="text-muted text-sm hidden sm:block">
            Chef · {user?.name || 'Staff'}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-on-surface font-mono text-lg tabular-nums">
            {clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
          <button
            onClick={handleLogout}
            className="text-muted hover:text-error transition-colors flex items-center gap-1 text-sm"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-surface-container-low px-6 py-2 flex gap-6 text-sm border-b border-outline-variant/10 flex-shrink-0">
        <span className="text-muted">Active <span className="text-on-surface font-semibold">{totalActive}</span></span>
        <span className="text-muted">New <span className="text-[#FF9E18] font-semibold">{orders.new.length}</span></span>
        <span className="text-muted">Preparing <span className="text-yellow-400 font-semibold">{orders.preparing.length}</span></span>
        <span className="text-muted">Ready <span className="text-green-400 font-semibold">{orders.ready.length}</span></span>
        <span className="text-muted">Done today <span className="text-on-surface font-semibold">{doneCount}</span></span>
        {/* Socket status dot */}
        <span className="ml-auto flex items-center gap-1.5 text-muted text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Overdue Alert */}
      {orders.new.some(o => getMinutesAgo(o.createdAt) > 15) && (
        <div className="bg-error-container/20 border-b border-error/30 px-6 py-2 flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
          <span className="text-error text-sm font-medium">Overdue orders need immediate attention!</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <span className="inline-block w-8 h-8 border-2 border-[#FF9E18] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Kanban Board */}
      {!loading && (
        <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
          {columns.map(col => (
            <div key={col.key} className="flex flex-col min-h-0">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3">
                <h2 className={`font-heading font-bold text-sm uppercase tracking-wider ${col.color}`}>
                  {col.label}
                </h2>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${col.color} bg-current/10`}
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  {orders[col.key].length}
                </span>
              </div>

              {/* Order cards */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {orders[col.key].length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-24 border border-dashed border-outline-variant/20 rounded-lg">
                    <p className="text-muted text-xs">{col.emptyMsg}</p>
                  </div>
                ) : (
                  orders[col.key].map(order => {
                    const mins = getMinutesAgo(order.createdAt);
                    const isOverdue = col.key === 'new' && mins > 15;
                    const isBusy = updating.has(order._id);

                    return (
                      <div
                        key={order._id}
                        className={`bg-surface-container-high rounded-lg p-4 transition-all duration-300
                          ${order._flash ? 'ring-2 ring-[#FF9E18] shadow-lg shadow-[#FF9E18]/20' : ''}
                          ${isOverdue ? 'border border-error/50' : ''}
                          ${isBusy ? 'opacity-60' : ''}`}
                      >
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="text-on-surface font-bold text-sm tracking-wide">
                            {order.orderNumber}
                          </h3>
                          <span className={`text-xs font-medium ${isOverdue ? 'text-error' : 'text-muted'}`}>
                            {isOverdue ? `⚠ ${mins}m overdue` : `${mins}m ago`}
                          </span>
                        </div>

                        {/* Table + type */}
                        <div className="flex items-center gap-2 mb-2">
                          {order.tableNumber && (
                            <span className="text-[#a0815a] text-[10px] font-medium bg-[#2e1b0e] px-2 py-0.5 rounded-sm">
                              Table {order.tableNumber}
                            </span>
                          )}
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-sm ${
                            order.orderType === 'takeaway'
                              ? 'bg-blue-900/30 text-blue-400'
                              : 'bg-[#FF9E18]/10 text-[#FF9E18]'
                          }`}>
                            {order.orderType === 'takeaway' ? 'Takeaway' : 'Dine-in'}
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="space-y-1 mb-3 border-t border-outline-variant/10 pt-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-baseline gap-2 text-xs">
                              <span className="text-[#FF9E18] font-bold w-5 text-right flex-shrink-0">
                                ×{item.qty}
                              </span>
                              <span className="text-on-surface-variant leading-snug">{item.name}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action button or ready badge */}
                        {col.key === 'ready' ? (
                          <div className="w-full text-center py-2 bg-green-900/20 rounded-sm border border-green-800/30">
                            <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">
                              ✓ Ready to serve
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => updateStatus(order._id, col.key, col.btn.next)}
                            disabled={isBusy}
                            className={`w-full text-xs font-bold py-2.5 rounded-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed ${col.btnStyle}`}
                          >
                            {isBusy ? (
                              <span className="flex items-center justify-center gap-1.5">
                                <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                Updating...
                              </span>
                            ) : col.btn.label}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
