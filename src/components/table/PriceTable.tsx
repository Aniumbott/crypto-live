import { useRef, useCallback, useEffect, useState, type MutableRefObject } from 'react';
import { usePriceWorker } from '@/hooks/usePriceWorker';
import { useSearch } from '@/hooks/useSearch';
import { useSort } from '@/hooks/useSort';
import { useFavorites } from '@/hooks/useFavorites';
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
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());
  
  const { coins, stats, refresh } = usePriceWorker({ priceRefs, rowRefs });
  const { query, filteredCoins, handleSearch } = useSearch(coins);
  const { sort, sortedCoins, toggleSort } = useSort(filteredCoins);
  const { toggle: toggleFavorite, isFavorite } = useFavorites();
  
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  
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
  
  const setRowRef = useCallback((symbol: string, el: HTMLTableRowElement | null) => {
    if (el) rowRefs.current.set(symbol, el);
    else rowRefs.current.delete(symbol);
  }, []);
  
  const handleCoinClick = useCallback((coin: CoinData) => {
    setSelectedCoinId(coin.id);
  }, []);
  
  if (coins.length === 0) {
    return <TableSkeleton />;
  }
  
  return (
    <>
      <div className="table-toolbar">
        <SearchInput
          value={query}
          onChange={handleSearch}
          placeholder="Search coins..."
        />
      </div>
      <div className="table-container">
        <table className="price-table" role="grid" aria-label="Cryptocurrency prices">
          <thead>
            <tr>
              <SortableHeader
                field="marketCapRank"
                currentField={sort.field}
                direction={sort.direction}
                onSort={toggleSort}
                className="col-rank"
              >
                #
              </SortableHeader>
              <SortableHeader
                field="name"
                currentField={sort.field}
                direction={sort.direction}
                onSort={toggleSort}
                className="col-name"
              >
                Name
              </SortableHeader>
              <SortableHeader
                field="currentPrice"
                currentField={sort.field}
                direction={sort.direction}
                onSort={toggleSort}
                className="col-price"
              >
                Price
              </SortableHeader>
              <SortableHeader
                field="priceChangePercent24h"
                currentField={sort.field}
                direction={sort.direction}
                onSort={toggleSort}
                className="col-change"
              >
                24h %
              </SortableHeader>
              <SortableHeader
                field="marketCap"
                currentField={sort.field}
                direction={sort.direction}
                onSort={toggleSort}
                className="col-mcap"
              >
                Market Cap
              </SortableHeader>
              <SortableHeader
                field="totalVolume"
                currentField={sort.field}
                direction={sort.direction}
                onSort={toggleSort}
                className="col-volume"
              >
                Volume (24h)
              </SortableHeader>
              <th scope="col" className="col-supply">Circulating Supply</th>
              <th scope="col" className="col-chart">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map((coin) => (
              <CoinRow
                key={coin.id}
                coin={coin}
                setPriceRef={setPriceRef}
                setRowRef={setRowRef}
                isFavorite={isFavorite(coin.id)}
                onToggleFavorite={() => toggleFavorite(coin.id)}
                onClick={() => handleCoinClick(coin)}
              />
            ))}
          </tbody>
        </table>
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