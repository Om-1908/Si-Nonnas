import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAuthStore from '../stores/authStore';
import api from '../lib/axios';

export default function Profile() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data)).catch(() => {});
  }, []);

  const statusColors = { new: 'text-blue-400', preparing: 'text-yellow-400', ready: 'text-green-400', complete: 'text-primary', cancelled: 'text-error' };

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest">
      <Navbar />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* User Card */}
          <div className="card mb-8 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary-container">person</span>
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-on-surface">{user?.name || 'Guest'}</h1>
              <p className="text-muted text-sm">{user?.email}</p>
            </div>
          </div>

          <h2 className="font-heading text-xl font-bold text-on-surface mb-5">Order History</h2>
          {orders.length === 0 ? (
            <div className="card text-center py-12">
              <span className="material-symbols-outlined text-4xl text-muted/40 mb-2 block">receipt_long</span>
              <p className="text-muted">No orders yet</p>
              <Link to="/menu" className="btn-primary mt-4 inline-block">Browse Menu</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order._id} className="card">
                  <button onClick={() => setExpanded(expanded === order._id ? null : order._id)} className="w-full flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-on-surface font-medium text-sm">{order.orderNumber}</h3>
                      <p className="text-muted text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium capitalize ${statusColors[order.status] || 'text-muted'}`}>{order.status}</p>
                      <p className="text-on-surface font-semibold text-sm">₹{order.total}</p>
                    </div>
                  </button>
                  {expanded === order._id && (
                    <div className="mt-4 pt-4 border-t border-outline-variant/10 animate-fade-in">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between py-1.5">
                          <span className="text-on-surface text-sm">{item.name} × {item.qty}</span>
                          <span className="text-muted text-sm">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                      {order.paymentStatus === 'paid' && (
                        <Link to={`/receipt/${order._id}`} className="text-primary text-xs hover:underline mt-2 inline-block">View receipt →</Link>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
