import { useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import { formatPrice, formatNumber, formatPercent } from '@/lib/formatters';
import { Sparkline } from '@/components/table/Sparkline';
import type { CoinData } from '@/types/coin';

interface CoinDetailModalProps {
  coinId: string;
  coins: CoinData[];
  onClose: () => void;
}

export function CoinDetailModal({ coinId, coins, onClose }: CoinDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const coin = coins.find((c) => c.id === coinId);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleBackdropKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  if (!coin) return null;

  const isPositive = coin.priceChangePercent24h >= 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl animate-scale-in overflow-hidden border border-surface-200 dark:border-surface-800"
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-surface-200 dark:border-surface-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-16 h-16 rounded-full ring-2 ring-surface-200 dark:ring-surface-700 bg-white"
            />
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-surface-900 dark:text-white">
                {coin.name}
              </h2>
              <p className="text-surface-500 dark:text-surface-400 uppercase">
                {coin.symbol} â€¢ Rank #{coin.marketCapRank}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Price Section */}
          <div>
            <p className="text-3xl font-bold font-mono text-surface-900 dark:text-white mb-2">
              {formatPrice(coin.currentPrice)}
            </p>
            <span
              className={`
                inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium
                ${isPositive
                  ? 'bg-success-50 text-success-700 dark:bg-success-950 dark:text-success-400'
                  : 'bg-danger-50 text-danger-700 dark:bg-danger-950 dark:text-danger-400'
                }
              `}
            >
              <svg
                className={`w-4 h-4 ${isPositive ? '' : 'rotate-180'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {formatPercent(Math.abs(coin.priceChangePercent24h))} (24h)
            </span>
          </div>

          {/* Chart */}
          <div className="bg-surface-50 dark:bg-surface-950/50 rounded-xl p-4 border border-surface-100 dark:border-surface-800">
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">Last 7 Days</p>
            <Sparkline data={coin.sparkline} isPositive={isPositive} width={400} height={80} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Market Cap"
              value={`$${formatNumber(coin.marketCap)}`}
            />
            <StatCard
              label="24h Volume"
              value={`$${formatNumber(coin.totalVolume)}`}
            />
            <StatCard
              label="Circulating Supply"
              value={`${formatNumber(coin.circulatingSupply)} ${coin.symbol}`}
            />
            <StatCard
              label="Volume/Market Cap"
              value={((coin.totalVolume / coin.marketCap) * 100).toFixed(2) + '%'}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-50 dark:bg-surface-950/50 border-t border-surface-200 dark:border-surface-800">
          <button
            className="btn btn-primary w-full justify-center"
            onClick={() => window.open(`https://www.coingecko.com/en/coins/${coin.id}`, '_blank')}
          >
            View on CoinGecko
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-50 dark:bg-surface-950/50 rounded-xl p-4 border border-surface-100 dark:border-surface-800">
      <p className="text-xs uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1">
        {label}
      </p>
      <p className="text-lg font-semibold text-surface-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}