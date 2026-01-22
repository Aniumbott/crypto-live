import { useState, useMemo, useCallback } from 'react';
import type { CoinData } from '@/types/coin';

// Export the SortField type for use in other components
export type SortField = 'marketCapRank' | 'name' | 'currentPrice' | 'priceChangePercent24h' | 'marketCap' | 'totalVolume';
export type SortDirection = 'asc' | 'desc';

interface SortState {
  field: SortField;
  direction: SortDirection;
}

export function useSort(coins: CoinData[]) {
  const [sort, setSort] = useState<SortState>({
    field: 'marketCapRank',
    direction: 'asc',
  });

  const toggleSort = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const sortedCoins = useMemo(() => {
    const sorted = [...coins];

    sorted.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sort.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [coins, sort]);

  return { sort, sortedCoins, toggleSort };
}