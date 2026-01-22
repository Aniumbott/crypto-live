import type { CoinData } from '@/types/coin';
import { formatPrice, formatPercent } from './formatters';

interface ShareData {
  title: string;
  text: string;
  url: string;
}

export function getCoinShareData(coin: CoinData): ShareData {
  const change = formatPercent(coin.priceChangePercent24h);
  const direction = coin.priceChangePercent24h >= 0 ? '📈' : '📉';

  return {
    title: `${coin.name} (${coin.symbol}) Price`,
    text: `${coin.name} is now ${formatPrice(coin.currentPrice)} ${direction} ${change} in 24h`,
    url: window.location.href,
  };
}

export async function shareCoin(coin: CoinData): Promise<boolean> {
  const shareData = getCoinShareData(coin);

  if (navigator.share && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err);
      }
      return false;
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    return true;
  } catch {
    return false;
  }
}
