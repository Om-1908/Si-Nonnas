import { create } from 'zustand';

const useOrderStore = create((set) => ({
  activeOrderId: null,
  status: null,

  setActiveOrder: (id) => set({ activeOrderId: id }),
  setStatus: (s) => set({ status: s }),
  clear: () => set({ activeOrderId: null, status: null }),
}));

export default useOrderStore;
