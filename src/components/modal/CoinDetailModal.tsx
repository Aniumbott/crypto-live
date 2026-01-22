import { useEffect, useRef, useMemo, useState, type MouseEvent } from 'react';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatCompact, formatPercent } from '@/lib/formatters';
import type { CoinData } from '@/types/coin';

interface CoinDetailModalProps {
  coinId: string;
  coins: CoinData[];
  onClose: () => void;
}

export function CoinDetailModal({ coinId, coins, onClose }: CoinDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { showToast } = useToast();
  const { alerts, addAlert, removeAlert } = usePriceAlerts(coins);
  
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [alertPrice, setAlertPrice] = useState<string>('');
  
  // Get the latest coin data from the live coins array
  const coin = useMemo(
    () => coins.find((c) => c.id === coinId),
    [coins, coinId]
  );
  
  // Filter alerts for this coin
  const coinAlerts = useMemo(
    () => alerts.filter((a) => a.coinId === coinId),
    [alerts, coinId]
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
  
  const handleAddAlert = () => {
    const price = parseFloat(alertPrice);
    if (isNaN(price) || price <= 0) {
      showToast('error', 'Please enter a valid price');
      return;
    }
    
    addAlert({
      coinId: coin.id,
      coinSymbol: coin.symbol.toUpperCase(),
      type: alertType,
      targetPrice: price,
      triggered: false,
    });
    
    showToast('success', `Alert set for ${coin.symbol.toUpperCase()} ${alertType} ${formatPrice(price)}`);
    setAlertPrice('');
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
          
          <div className="alert-section">
            <h3 className="alert-section-title">Price Alerts</h3>
            
            <div className="alert-form">
              <select 
                value={alertType} 
                onChange={(e) => setAlertType(e.target.value as 'above' | 'below')}
                className="alert-select"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
              
              <input
                type="number"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                placeholder="Enter price..."
                className="alert-input"
                step="any"
                min="0"
              />
              
              <button onClick={handleAddAlert} className="alert-button">
                Add Alert
              </button>
            </div>
            
            {coinAlerts.length > 0 && (
              <ul className="alert-list">
                {coinAlerts.map((alert) => (
                  <li key={alert.id} className={`alert-item ${alert.triggered ? 'triggered' : ''}`}>
                    <div className="alert-info">
                      <span className="alert-type">
                        {alert.type === 'above' ? '↑' : '↓'} {alert.type}
                      </span>
                      <span className="alert-price">{formatPrice(alert.targetPrice)}</span>
                      {alert.triggered && <span className="alert-triggered-badge">Triggered</span>}
                    </div>
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="alert-remove"
                      aria-label="Remove alert"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
