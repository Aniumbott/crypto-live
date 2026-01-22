import { memo } from 'react';
import { Sparkline } from './Sparkline';
import { formatPrice, formatPercent, formatCompact, formatSupply } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import type { CoinData } from '@/types/coin';

interface CoinRowProps {
  coin: CoinData;
  setPriceRef: (symbol: string, el: HTMLSpanElement | null) => void;
  setRowRef: (symbol: string, el: HTMLTableRowElement | null) => void;
}

export const CoinRow = memo(function CoinRow({ coin, setPriceRef, setRowRef }: CoinRowProps) {
  const isPositive = coin.priceChangePercent24h >= 0;
  
  return (
    <tr
      ref={(el) => setRowRef(coin.symbol, el)}
      className="coin-row"
      data-symbol={coin.symbol}
    >
      <td className="col-rank">
        <span className="rank">{coin.marketCapRank}</span>
      </td>
      
      <td className="col-name">
        <div className="coin-identity">
          <img
            src={coin.image}
            alt=""
            className="coin-icon"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 
                `https://ui-avatars.com/api/?name=${coin.symbol}&background=random&size=32`;
            }}
          />
          <div className="coin-names">
            <span className="coin-name">{coin.name}</span>
            <span className="coin-symbol">{coin.symbol}</span>
          </div>
        </div>
      </td>
      
      <td className="col-price">
        <span ref={(el) => setPriceRef(coin.symbol, el)} className="price">
          {formatPrice(coin.currentPrice)}
        </span>
      </td>
      
      <td className="col-change">
        <span className={cn('change', isPositive ? 'positive' : 'negative')}>
          {isPositive ? '▲' : '▼'} {formatPercent(coin.priceChangePercent24h).replace(/[+-]/g, '')}
        </span>
      </td>
      
      <td className="col-mcap">
        <span className="muted">{formatCompact(coin.marketCap)}</span>
      </td>
      
      <td className="col-volume">
        <span className="muted">{formatCompact(coin.totalVolume)}</span>
      </td>
      
      <td className="col-supply">
        <span className="muted">{formatSupply(coin.circulatingSupply, coin.symbol)}</span>
      </td>
      
      <td className="col-chart">
        <Sparkline data={coin.sparkline} positive={isPositive} />
      </td>
    </tr>
  );
});