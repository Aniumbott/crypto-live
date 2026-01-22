import { memo } from 'react';
import { formatPrice, formatNumber, formatPercent } from '@/lib/formatters';
import { Sparkline } from './Sparkline';
import { FavoriteButton } from '@/components/common/FavoriteButton';
import type { CoinData } from '@/types/coin';

interface CoinRowProps {
  coin: CoinData;
  setPriceRef: (symbol: string, el: HTMLSpanElement | null) => void;
  // setRowRef was removed from here
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
  isSelected: boolean;
}

export const CoinRow = memo(function CoinRow({
  coin,
  setPriceRef,
  // setRowRef was removed from props
  isFavorite,
  onToggleFavorite,
  onClick,
  isSelected,
}: CoinRowProps) {
  const isPositive = coin.priceChangePercent24h >= 0;

  return (
    <tr
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="row"
      aria-selected={isSelected}
      className={`
        group cursor-pointer transition-all duration-200
        hover:bg-surface-50 dark:hover:bg-surface-800/50
        focus:outline-none focus:bg-primary-50 dark:focus:bg-primary-900/10
        ${isSelected ? 'bg-primary-50 dark:bg-primary-900/10 ring-1 ring-primary-500/50' : ''}
      `}
    >
      {/* Rank */}
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <FavoriteButton
            isFavorite={isFavorite}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-sm font-medium text-surface-500 dark:text-surface-400">
            {coin.marketCapRank}
          </span>
        </div>
      </td>

      {/* Name & Symbol */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-10 h-10 rounded-full ring-1 ring-surface-200 dark:ring-surface-700 bg-white"
              loading="lazy"
            />
            {isFavorite && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-2.5 h-2.5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {coin.name}
            </p>
            <p className="text-sm text-surface-500 dark:text-surface-400 uppercase">
              {coin.symbol}
            </p>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-4 text-right">
        <span
          ref={(el) => setPriceRef(coin.symbol, el)}
          className="font-mono font-semibold text-surface-900 dark:text-white transition-colors duration-300"
        >
          {formatPrice(coin.currentPrice)}
        </span>
      </td>

      {/* 24h Change */}
      <td className="px-4 py-4 text-right">
        <span
          className={`
            inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium text-sm
            ${isPositive
              ? 'bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-400'
              : 'bg-danger-50 text-danger-700 dark:bg-danger-950/50 dark:text-danger-400'
            }
          `}
        >
          <svg
            className={`w-3.5 h-3.5 ${isPositive ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {formatPercent(Math.abs(coin.priceChangePercent24h))}
        </span>
      </td>

      {/* Market Cap */}
      <td className="px-4 py-4 text-right hidden md:table-cell">
        <span className="text-surface-700 dark:text-surface-300">
          ${formatNumber(coin.marketCap)}
        </span>
      </td>

      {/* Volume */}
      <td className="px-4 py-4 text-right hidden lg:table-cell">
        <span className="text-surface-700 dark:text-surface-300">
          ${formatNumber(coin.totalVolume)}
        </span>
      </td>

      {/* Circulating Supply */}
      <td className="px-4 py-4 text-right hidden xl:table-cell">
        <span className="text-surface-700 dark:text-surface-300">
          {formatNumber(coin.circulatingSupply)} {coin.symbol}
        </span>
      </td>

      {/* Sparkline */}
      <td className="px-4 py-4 hidden sm:table-cell">
        <div className="flex justify-end">
          <Sparkline
            data={coin.sparkline}
            isPositive={isPositive}
            width={100}
            height={32}
          />
        </div>
      </td>
    </tr>
  );
});