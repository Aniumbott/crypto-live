import { useState, useMemo, useCallback } from 'react';
import type { CoinData } from '@/types/coin';

export type SortField =
  | 'marketCapRank'
  | 'name'
  | 'currentPrice'
  | 'priceChangePercent24h'
  | 'marketCap'
  | 'totalVolume';

export type SortDirection = 'asc' | 'desc';

interface SortState {
  field: SortField;
  direction: SortDirection;
}

const defaultSort: SortState = { field: 'marketCapRank', direction: 'asc' };

export function useSort(coins: CoinData[]) {
  const [sort, setSort] = useState<SortState>(defaultSort);

  const sortedCoins = useMemo(() => {
    const sorted = [...coins].sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sort.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      const aNum = aVal as number;
      const bNum = bVal as number;

      return sort.direction === 'asc' ? aNum - bNum : bNum - aNum;
    });

    return sorted;
  }, [coins, sort]);

  const toggleSort = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return { sort, sortedCoins, toggleSort };
}
