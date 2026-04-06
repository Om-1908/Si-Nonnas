import { create } from 'zustand';

const getStoredAuth = () => {
  try {
    const user = JSON.parse(localStorage.getItem('sn_user'));
    const role = localStorage.getItem('sn_role');
    const token = localStorage.getItem('sn_token');
    return { user, role, token };
  } catch {
    return { user: null, role: null, token: null };
  }
};

const useAuthStore = create((set) => ({
  ...getStoredAuth(),

  setAuth: (user, role, token) => {
    localStorage.setItem('sn_user', JSON.stringify(user));
    localStorage.setItem('sn_role', role);
    localStorage.setItem('sn_token', token);
    set({ user, role, token });
  },

  clear: () => {
    localStorage.removeItem('sn_user');
    localStorage.removeItem('sn_role');
    localStorage.removeItem('sn_token');
    set({ user: null, role: null, token: null });
  },
}));

export default useAuthStore;
