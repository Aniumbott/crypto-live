import { useRef, useCallback, useEffect, type MutableRefObject } from 'react';
import { usePriceWorker } from '@/hooks/usePriceWorker';
import { CoinRow } from './CoinRow';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import type { WorkerStats } from '@/types/worker';

interface PriceTableProps {
  onStatsChange: (stats: WorkerStats) => void;
  refreshRef: MutableRefObject<(() => void) | null>;
}

export function PriceTable({ onStatsChange, refreshRef }: PriceTableProps) {
  const priceRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());
  
  const { coins, stats, refresh } = usePriceWorker({ priceRefs, rowRefs });
  
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
  
  if (coins.length === 0) {
    return <TableSkeleton />;
  }
  
  return (
    <div className="table-container">
      <table className="price-table" role="grid" aria-label="Cryptocurrency prices">
        <thead>
          <tr>
            <th scope="col" className="col-rank">#</th>
            <th scope="col" className="col-name">Name</th>
            <th scope="col" className="col-price">Price</th>
            <th scope="col" className="col-change">24h %</th>
            <th scope="col" className="col-mcap">Market Cap</th>
            <th scope="col" className="col-volume">Volume (24h)</th>
            <th scope="col" className="col-supply">Circulating Supply</th>
            <th scope="col" className="col-chart">Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <CoinRow
              key={coin.id}
              coin={coin}
              setPriceRef={setPriceRef}
              setRowRef={setRowRef}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}