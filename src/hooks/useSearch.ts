import { useState, useMemo, useCallback } from 'react';
import type { CoinData } from '@/types/coin';

export function useSearch(coins: CoinData[]) {
  const [query, setQuery] = useState('');

  const filteredCoins = useMemo(() => {
    if (!query.trim()) return coins;

    const lowerQuery = query.toLowerCase();
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(lowerQuery) ||
        coin.symbol.toLowerCase().includes(lowerQuery)
    );
  }, [coins, query]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return { query, filteredCoins, handleSearch };
}
