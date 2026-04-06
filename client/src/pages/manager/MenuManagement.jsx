import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { showToast } from '../../components/Toast';
import { mockMenuItems, CATEGORY_LABELS } from '../../lib/mockData';

export default function MenuManagement() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'pizzas', isVeg: false, imageUrl: '' });
  // Inline confirm state: stores the _id of the item pending delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ['menu-admin'],
    queryFn: async () => { const { data } = await api.get('/menu/admin'); return data; },
    placeholderData: mockMenuItems,
  });

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category: 'pizzas', isVeg: false, imageUrl: '' });
    setEditItem(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.patch(`/menu/${editItem._id}`, { ...form, price: Number(form.price) });
        showToast('Item updated', 'success');
      } else {
        await api.post('/menu', { ...form, price: Number(form.price) });
        showToast('Item created', 'success');
      }
      queryClient.invalidateQueries({ queryKey: ['menu-admin'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      resetForm();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await api.patch(`/menu/${item._id}`, { is_available: !item.is_available });
      queryClient.invalidateQueries({ queryKey: ['menu-admin'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    } catch { showToast('Failed to update', 'error'); }
  };

  // Step 1: show inline confirm UI
  const initiateDelete = (item) => setConfirmDeleteId(item._id);

  // Step 2: actually delete after confirm
  const confirmDelete = async (item) => {
    setDeleting(true);
    try {
      await api.delete(`/menu/${item._id}`);
      // Optimistic removal from cached list
      queryClient.setQueryData(['menu-admin'], (old = []) => old.filter(i => i._id !== item._id));
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      showToast('Item removed from menu', 'success');
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setConfirmDeleteId(null);
      setDeleting(false);
    }
  };

  const openEdit = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, isVeg: item.isVeg, imageUrl: item.imageUrl || '' });
    setEditItem(item);
    setShowForm(true);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold text-on-surface">Menu Management</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span> Add new item
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="card mb-8 animate-fade-in">
          <h2 className="font-heading font-semibold text-on-surface mb-4">{editItem ? 'Edit Item' : 'New Menu Item'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Item name" />
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="Price (₹)" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input type="text" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="input-field" placeholder="Image URL" />
          </div>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field mb-4 h-20 resize-none" placeholder="Description" />
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isVeg} onChange={e => setForm({ ...form, isVeg: e.target.checked })} className="rounded border-outline-variant" />
              <span className="text-on-surface text-sm">Vegetarian</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-primary">{editItem ? 'Save changes' : 'Save item'}</button>
            <button onClick={resetForm} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item._id} className={`card ${!item.is_available ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-3 mb-3">
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={item.isVeg ? 'badge-veg' : 'badge-nonveg'} />
                  <h3 className="text-on-surface text-sm font-semibold truncate">{item.name}</h3>
                </div>
                <p className="text-primary text-sm font-medium">₹{item.price}</p>
              </div>
            </div>

            {/* Inline delete confirm UI */}
            {confirmDeleteId === item._id ? (
              <div className="bg-red-900/20 border border-red-700/40 rounded-[2px] p-3 flex items-center justify-between gap-2">
                <span className="text-red-400 text-xs font-medium">Remove "{item.name}"?</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => confirmDelete(item)}
                    disabled={deleting}
                    className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-[2px] hover:bg-red-500 disabled:opacity-50"
                  >
                    {deleting ? '...' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-[#a0815a] text-[10px] px-2 py-1.5 hover:text-[#ffdbc7]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleAvailability(item)}
                  className={`text-xs px-3 py-1 rounded-sm font-medium ${item.is_available ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-error'}`}
                >
                  {item.is_available ? 'In Stock' : 'Out of Stock'}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="text-muted hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button onClick={() => initiateDelete(item)} className="text-muted hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
