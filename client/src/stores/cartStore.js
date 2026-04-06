import { create } from 'zustand';

const getStoredCart = () => {
  try {
    return JSON.parse(sessionStorage.getItem('sn_cart')) || { items: [], tableNumber: null, orderType: 'dine-in' };
  } catch {
    return { items: [], tableNumber: null, orderType: 'dine-in' };
  }
};

const persistCart = (state) => {
  sessionStorage.setItem('sn_cart', JSON.stringify({
    items: state.items,
    tableNumber: state.tableNumber,
    orderType: state.orderType,
  }));
};

const useCartStore = create((set, get) => ({
  ...getStoredCart(),
  isOpen: false,

  addItem: (item) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i._id === item._id);
    if (idx >= 0) {
      items[idx].qty += 1;
    } else {
      items.push({ ...item, qty: 1 });
    }
    set({ items });
    persistCart({ ...get(), items });
  },

  removeItem: (id) => {
    const items = get().items.filter((i) => i._id !== id);
    set({ items });
    persistCart({ ...get(), items });
  },

  updateQty: (id, qty) => {
    if (qty <= 0) return get().removeItem(id);
    const items = get().items.map((i) => (i._id === id ? { ...i, qty } : i));
    set({ items });
    persistCart({ ...get(), items });
  },

  setTableNumber: (n) => {
    set({ tableNumber: n });
    persistCart({ ...get(), tableNumber: n });
  },

  setOrderType: (t) => {
    set({ orderType: t });
    persistCart({ ...get(), orderType: t });
  },

  clearCart: () => {
    set({ items: [], tableNumber: null, orderType: 'dine-in' });
    sessionStorage.removeItem('sn_cart');
  },

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
}));

export default useCartStore;
