import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import api from '../lib/axios';
import socket from '../lib/socket';
import { showToast } from '../components/Toast';
import { mockOrders } from '../lib/mockData';

export default function KitchenDashboard() {
  const { user, clear } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState({ new: [], preparing: [], ready: [] });
  const [doneCount, setDoneCount] = useState(0);
  const [clock, setClock] = useState(new Date());
  const flashRef = useRef(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders?status=new,preparing,ready&limit=100');
        groupOrders(data);
      } catch {
        groupOrders(mockOrders);
      }
    };
    fetchOrders();
  }, []);

  // Socket
  useEffect(() => {
    socket.connect();
    socket.emit('join', 'kitchen');
    socket.on('new-order', (order) => {
      setOrders(prev => ({ ...prev, new: [{ ...order, _flash: true }, ...prev.new] }));
      setTimeout(() => {
        setOrders(prev => ({
          ...prev,
          new: prev.new.map(o => o._id === order._id ? { ...o, _flash: false } : o),
        }));
      }, 1500);
    });
    return () => { socket.off('new-order'); socket.disconnect(); };
  }, []);

  const groupOrders = (list) => {
    setOrders({
      new: list.filter(o => o.status === 'new'),
      preparing: list.filter(o => o.status === 'preparing'),
      ready: list.filter(o => o.status === 'ready'),
    });
  };

  const updateStatus = async (id, from, to) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: to });
      setOrders(prev => {
        const order = prev[from].find(o => o._id === id);
        if (!order) return prev;
        const updated = { ...prev };
        updated[from] = prev[from].filter(o => o._id !== id);
        if (to === 'complete') {
          setDoneCount(c => c + 1);
        } else {
          updated[to] = [...prev[to], { ...order, status: to }];
        }
        return updated;
      });
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleLogout = () => { clear(); navigate('/login'); };

  const getMinutesAgo = (date) => Math.floor((Date.now() - new Date(date).getTime()) / 60000);

  const totalActive = orders.new.length + orders.preparing.length + orders.ready.length;

  return (
    <div className="h-screen flex flex-col bg-surface-container-lowest overflow-hidden">
      {/* Top Bar */}
      <header className="bg-surface-container border-b border-outline-variant/10 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-lg font-bold text-primary-container uppercase tracking-wider">Si Nonna's Kitchen</h1>
          <span className="text-muted text-sm hidden sm:block">Chef de Cuisine · {user?.name || 'Staff'}</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-on-surface font-mono text-lg tabular-nums">
            {clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
          <button onClick={handleLogout} className="text-muted hover:text-error transition-colors flex items-center gap-1 text-sm">
            <span className="material-symbols-outlined text-lg">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-surface-container-low px-6 py-2 flex gap-6 text-sm border-b border-outline-variant/10 flex-shrink-0">
        <span className="text-muted">Active <span className="text-on-surface font-semibold">{totalActive}</span></span>
        <span className="text-muted">New <span className="text-primary-container font-semibold">{orders.new.length}</span></span>
        <span className="text-muted">Preparing <span className="text-yellow-400 font-semibold">{orders.preparing.length}</span></span>
        <span className="text-muted">Ready <span className="text-green-400 font-semibold">{orders.ready.length}</span></span>
        <span className="text-muted">Done today <span className="text-on-surface font-semibold">{doneCount}</span></span>
      </div>

      {/* Overdue Alert */}
      {orders.new.some(o => getMinutesAgo(o.createdAt) > 15) && (
        <div className="bg-error-container/20 border-b border-error/30 px-6 py-2 flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
          <span className="text-error text-sm font-medium">Overdue orders need immediate attention!</span>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
        {[
          { key: 'new', label: 'New Orders', color: 'text-primary-container', btnLabel: 'Start preparing', btnAction: (id) => updateStatus(id, 'new', 'preparing') },
          { key: 'preparing', label: 'Preparing', color: 'text-yellow-400', btnLabel: 'Mark ready', btnAction: (id) => updateStatus(id, 'preparing', 'ready') },
          { key: 'ready', label: 'Ready to Serve', color: 'text-green-400', btnLabel: 'Complete & bill', btnAction: (id) => updateStatus(id, 'ready', 'complete') },
        ].map(col => (
          <div key={col.key} className="flex flex-col min-h-0">
            <h2 className={`font-heading font-bold text-sm uppercase tracking-wider mb-3 ${col.color}`}>
              {col.label} ({orders[col.key].length})
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {orders[col.key].map(order => {
                const mins = getMinutesAgo(order.createdAt);
                const isOverdue = col.key === 'new' && mins > 15;
                return (
                  <div key={order._id}
                    className={`bg-surface-container-high rounded-lg p-4 transition-all duration-300
                      ${order._flash ? 'animate-card-flash' : ''}
                      ${isOverdue ? 'border border-error/50' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-on-surface font-semibold text-sm">{order.orderNumber}</h3>
                      <span className={`text-xs font-medium ${isOverdue ? 'text-error' : 'text-muted'}`}>
                        {isOverdue ? `Overdue · ${mins} min` : `${mins} min ago`}
                      </span>
                    </div>
                    {order.tableNumber && <p className="text-muted text-xs mb-2">Table {order.tableNumber}</p>}
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className="text-primary-container font-bold">×{item.qty}</span>
                          <span className="text-on-surface-variant">{item.name}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => col.btnAction(order._id)}
                      className={`w-full text-xs font-semibold py-2 rounded-sm transition-all ${
                        col.key === 'ready'
                          ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                          : 'bg-primary-container/15 text-primary hover:bg-primary-container/25'
                      }`}>
                      {col.btnLabel}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
