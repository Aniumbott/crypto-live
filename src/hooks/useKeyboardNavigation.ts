import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  onUp?: () => void;
  onDown?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onUp,
  onDown,
  onEnter,
  onEscape,
  enabled = true,
}: KeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onDown?.();
          break;
        case 'Enter':
          onEnter?.();
          break;
        case 'Escape':
          onEscape?.();
          break;
      }
    },
    [enabled, onUp, onDown, onEnter, onEscape]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
