import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import socket from '../../lib/socket';
import { showToast } from '../../components/Toast';
import { mockReviews } from '../../lib/mockData';

export default function ReviewManagement() {
  const queryClient = useQueryClient();
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('');
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newIds, setNewIds] = useState(new Set());

  const fetchReviews = (rating = '') => {
    const qs = rating ? `?rating=${rating}` : '';
    api.get(`/reviews${qs}`).then(r => setReviews(r.data)).catch(() => setReviews(mockReviews));
  };

  useEffect(() => { fetchReviews(); }, []);

  // Socket.io real-time listener
  useEffect(() => {
    socket.connect();
    socket.on('new-review', (review) => {
      setReviews(prev => [review, ...prev]);
      setNewIds(prev => new Set([...prev, review._id]));
      setTimeout(() => {
        setNewIds(prev => {
          const next = new Set(prev);
          next.delete(review._id);
          return next;
        });
      }, 2000);
      queryClient.invalidateQueries(['reviews']);
    });
    return () => {
      socket.off('new-review');
      socket.disconnect();
    };
  }, [queryClient]);

  const handleReply = async (id) => {
    try {
      await api.post(`/reviews/${id}/reply`, { message: replyText });
      fetchReviews(filter);
      setReplyId(null);
      setReplyText('');
      showToast('Reply sent', 'success');
    } catch { showToast('Failed to reply', 'error'); }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="font-heading text-2xl font-bold text-on-surface mb-6">Customer Reviews</h1>

      {/* Star Filter */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => { setFilter(''); fetchReviews(); }}
          className={`px-4 py-2 rounded-sm text-sm ${!filter ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-muted'}`}>
          All
        </button>
        {[5, 4, 3, 2, 1].map(n => (
          <button key={n} onClick={() => { setFilter(n); fetchReviews(n); }}
            className={`px-3 py-2 rounded-sm text-sm ${filter === n ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-muted'}`}>
            {n}★
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {reviews.map(r => (
          <div
            key={r._id}
            className="card transition-all duration-300"
            style={newIds.has(r._id) ? { border: '1px solid rgba(255,158,24,0.7)', boxShadow: '0 0 8px rgba(255,158,24,0.2)' } : {}}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-primary-container text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className="text-on-surface text-sm font-medium">{r.user?.name || 'Guest'}</span>
                <span className="text-muted text-xs">— {r.order?.orderNumber || ''}</span>
                {newIds.has(r._id) && (
                  <span className="text-[#FF9E18] text-[10px] font-bold uppercase animate-pulse">New</span>
                )}
              </div>
              <span className="text-muted text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <p className="text-on-surface-variant text-sm italic mb-3">"{r.comment}"</p>

            {r.reply ? (
              <div className="bg-surface-container-low rounded-md p-3 mt-2">
                <p className="text-muted text-xs mb-1">Manager reply:</p>
                <p className="text-on-surface text-sm">{r.reply}</p>
              </div>
            ) : replyId === r._id ? (
              <div className="mt-2 animate-fade-in">
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                  className="input-field h-16 resize-none mb-2" placeholder="Write a reply..." />
                <div className="flex gap-2">
                  <button onClick={() => handleReply(r._id)} className="btn-primary text-xs !py-1.5 !px-4">Send</button>
                  <button onClick={() => setReplyId(null)} className="btn-ghost text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setReplyId(r._id); setReplyText(''); }}
                className="text-primary text-xs hover:underline mt-1">
                Reply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
