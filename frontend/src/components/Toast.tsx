import { useEffect } from 'react';
import { useToastStore, type ToastItem } from '../store/toast-store';
import './Toast.css';

const DURATION = 2600;

function ToastCard({ item }: { item: ToastItem }) {
  const remove = useToastStore((s) => s.remove);

  // 自动消失
  useEffect(() => {
    const timer = window.setTimeout(() => remove(item.id), DURATION);
    return () => window.clearTimeout(timer);
  }, [remove, item.id]);

  return (
    <div className={`toast toast-${item.type}`} role="status">
      <span className="toast-dot" />
      <span className="toast-message">{item.message}</span>
      <button
        className="toast-close"
        onClick={() => remove(item.id)}
        aria-label="关闭提示"
      >
        ✕
      </button>
    </div>
  );
}

export default function Toast() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} />
      ))}
    </div>
  );
}
