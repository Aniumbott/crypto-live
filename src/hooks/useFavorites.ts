import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'crypto-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();

    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggle = useCallback((coinId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(coinId)) {
        next.delete(coinId);
      } else {
        next.add(coinId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (coinId: string) => favorites.has(coinId),
    [favorites]
  );

  return { favorites, toggle, isFavorite };
}
