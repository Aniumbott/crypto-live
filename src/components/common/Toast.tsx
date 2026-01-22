import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onDismiss: () => void;
}

export function Toast({ type, message, onDismiss }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    ref.current?.focus();
  }, []);
  
  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className={cn('toast', `toast-${type}`)}
    >
      <span className="toast-icon" aria-hidden="true">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
      </span>
      <span className="toast-message">{message}</span>
      <button
        onClick={onDismiss}
        className="toast-close"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}