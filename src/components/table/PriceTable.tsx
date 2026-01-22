import { useRef, useCallback, useEffect, useState, type MutableRefObject } from 'react';
import { usePriceWorker } from '@/hooks/usePriceWorker';
import { useSearch } from '@/hooks/useSearch';
import { useSort } from '@/hooks/useSort';
import { useFavorites } from '@/hooks/useFavorites';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { CoinRow } from './CoinRow';
import { SortableHeader } from './SortableHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { CoinDetailModal } from '@/components/modal/CoinDetailModal';
import type { WorkerStats } from '@/types/worker';
import type { CoinData } from '@/types/coin';

interface PriceTableProps {
  onStatsChange: (stats: WorkerStats) => void;
  refreshRef: MutableRefObject<(() => void) | null>;
}

export function PriceTable({ onStatsChange, refreshRef }: PriceTableProps) {
  const priceRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  const { coins, stats, refresh } = usePriceWorker({ priceRefs });
  const { query, filteredCoins, handleSearch } = useSearch(coins);
  const { sort, sortedCoins, toggleSort } = useSort(filteredCoins);
  const { toggle: toggleFavorite, isFavorite } = useFavorites();

  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const sortedCoinsRef = useRef(sortedCoins);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    sortedCoinsRef.current = sortedCoins;
  }, [sortedCoins]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex >= sortedCoins.length) {
      setSelectedIndex(sortedCoins.length - 1);
    }
  }, [sortedCoins, selectedIndex]);

  const handleKeyUp = useCallback(() => {
    const coinsLength = sortedCoinsRef.current.length;
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : coinsLength - 1));
  }, []);

  const handleKeyDown = useCallback(() => {
    const coinsLength = sortedCoinsRef.current.length;
    setSelectedIndex((prev) => (prev < coinsLength - 1 ? prev + 1 : 0));
  }, []);

  const handleKeyEnter = useCallback(() => {
    const idx = selectedIndexRef.current;
    const coins = sortedCoinsRef.current;
    if (idx >= 0 && idx < coins.length) {
      setSelectedCoinId(coins[idx].id);
    }
  }, []);

  const handleKeyEscape = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  useKeyboardNavigation({
    onUp: handleKeyUp,
    onDown: handleKeyDown,
    onEnter: handleKeyEnter,
    onEscape: handleKeyEscape,
    enabled: selectedCoinId === null && sortedCoins.length > 0,
  });

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh, refreshRef]);

  useEffect(() => {
    onStatsChange(stats);
  }, [stats, onStatsChange]);

  const setPriceRef = useCallback((symbol: string, el: HTMLSpanElement | null) => {
    if (el) priceRefs.current.set(symbol, el);
    else priceRefs.current.delete(symbol);
  }, []);

  const handleCoinClick = useCallback((coin: CoinData) => {
    setSelectedCoinId(coin.id);
  }, []);

  if (coins.length === 0) {
    return <TableSkeleton />;
  }

  // No Results State
  if (sortedCoins.length === 0 && query) {
    return (
      <>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <SearchInput value={query} onChange={handleSearch} placeholder="Search coins..." />
        </div>
        <div className="card p-12 text-center">
          <div className="mx-auto w-12 h-12 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-surface-900 dark:text-white">No coins found</h3>
          {/* FIX: Escaped quotes */}
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            We couldn&apos;t find any coins matching &quot;{query}&quot;
          </p>
          <button
            onClick={() => handleSearch('')}
            className="btn btn-secondary mt-4"
          >
            Clear Search
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <SearchInput
          value={query}
          onChange={handleSearch}
          placeholder="Search coins..."
        />
        <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-200 dark:bg-surface-800 text-xs font-mono">
            ↑
          </kbd>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-200 dark:bg-surface-800 text-xs font-mono">
            ↓
          </kbd>
          <span className="hidden sm:inline">Navigate</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-200 dark:bg-surface-800 text-xs font-mono">
            Enter
          </kbd>
          <span className="hidden sm:inline">Select</span>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full" role="grid" aria-label="Cryptocurrency prices">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50">
                <SortableHeader
                  field="marketCapRank"
                  currentField={sort.field}
                  direction={sort.direction}
                  onSort={toggleSort}
                  className="w-12 text-center"
                >
                  #
                </SortableHeader>
                <SortableHeader
                  field="name"
                  currentField={sort.field}
                  direction={sort.direction}
                  onSort={toggleSort}
                  className="text-left min-w-[180px]"
                >
                  Name
                </SortableHeader>
                <SortableHeader
                  field="currentPrice"
                  currentField={sort.field}
                  direction={sort.direction}
                  onSort={toggleSort}
                  className="text-right min-w-[120px]"
                >
                  Price
                </SortableHeader>
                <SortableHeader
                  field="priceChangePercent24h"
                  currentField={sort.field}
                  direction={sort.direction}
                  onSort={toggleSort}
                  className="text-right min-w-[100px]"
                >
                  24h %
                </SortableHeader>
                <SortableHeader
                  field="marketCap"
                  currentField={sort.field}
                  direction={sort.direction}
                  onSort={toggleSort}
                  className="text-right min-w-[140px] hidden md:table-cell"
                >
                  Market Cap
                </SortableHeader>
                <SortableHeader
                  field="totalVolume"
                  currentField={sort.field}
                  direction={sort.direction}
                  onSort={toggleSort}
                  className="text-right min-w-[140px] hidden lg:table-cell"
                >
                  Volume (24h)
                </SortableHeader>
                <th className="text-right min-w-[140px] hidden xl:table-cell px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  Circulating Supply
                </th>
                <th className="text-right min-w-[120px] hidden sm:table-cell px-4 py-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                  Last 7 Days
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {sortedCoins.map((coin, index) => (
                <CoinRow
                  key={coin.id}
                  coin={coin}
                  setPriceRef={setPriceRef}
                  isFavorite={isFavorite(coin.id)}
                  onToggleFavorite={() => toggleFavorite(coin.id)}
                  onClick={() => handleCoinClick(coin)}
                  isSelected={index === selectedIndex}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCoinId && (
        <CoinDetailModal
          coinId={selectedCoinId}
          coins={coins}
          onClose={() => setSelectedCoinId(null)}
        />
      )}
    </>
  );
}