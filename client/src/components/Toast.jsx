import { useState, useEffect } from 'react';

let toastId = 0;
const listeners = new Set();
let toasts = [];

export function showToast(message, type = 'info', duration = 4000) {
  const id = ++toastId;
  toasts = [...toasts, { id, message, type, duration }];
  listeners.forEach((fn) => fn(toasts));
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn(toasts));
  }, duration);
}

export default function ToastContainer() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    listeners.add(setItems);
    return () => listeners.delete(setItems);
  }, []);

  const colors = {
    success: 'bg-green-900/80 border-green-500/30 text-green-200',
    error: 'bg-red-900/80 border-red-500/30 text-red-200',
    info: 'bg-surface-container-highest border-primary-container/30 text-primary',
  };

  const icons = { success: 'check_circle', error: 'error', info: 'info' };

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2 max-w-sm">
      {items.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg border animate-slide-up ${colors[t.type] || colors.info}`}>
          <span className="material-symbols-outlined text-lg">{icons[t.type] || icons.info}</span>
          <span className="text-sm">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
