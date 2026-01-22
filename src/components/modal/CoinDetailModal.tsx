import { useEffect, useRef, useMemo, type MouseEvent } from 'react';
import { formatPrice, formatCompact, formatPercent } from '@/lib/formatters';
import type { CoinData } from '@/types/coin';

interface CoinDetailModalProps {
  coinId: string;
  coins: CoinData[];
  onClose: () => void;
}

export function CoinDetailModal({ coinId, coins, onClose }: CoinDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  // Get the latest coin data from the live coins array
  const coin = useMemo(
    () => coins.find((c) => c.id === coinId),
    [coins, coinId]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  if (!coin) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
    <dialog
      ref={dialogRef}
      className="coin-modal"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div className="modal-content" role="document">
        <header className="modal-header">
          <div className="modal-title">
            <img src={coin.image} alt="" className="modal-coin-icon" />
            <div>
              <h2 id="modal-title">{coin.name}</h2>
              <span className="modal-symbol">{coin.symbol}</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            ×
          </button>
        </header>

        <div className="modal-body">
          <div className="price-display">
            <span className="current-price">{formatPrice(coin.currentPrice)}</span>
            <span
              className={`change ${coin.priceChangePercent24h >= 0 ? 'positive' : 'negative'}`}
            >
              {formatPercent(coin.priceChangePercent24h)}
            </span>
          </div>

          <dl className="stats-grid">
            <div className="stat">
              <dt>Market Cap</dt>
              <dd>{formatCompact(coin.marketCap)}</dd>
            </div>
            <div className="stat">
              <dt>24h Volume</dt>
              <dd>{formatCompact(coin.totalVolume)}</dd>
            </div>
            <div className="stat">
              <dt>Rank</dt>
              <dd>#{coin.marketCapRank}</dd>
            </div>
            <div className="stat">
              <dt>Circulating Supply</dt>
              <dd>
                {coin.circulatingSupply.toLocaleString()} {coin.symbol}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </dialog>
  );
}
