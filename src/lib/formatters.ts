const formattersCache = new Map<string, Intl.NumberFormat>();

function getFormatter(key: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  if (!formattersCache.has(key)) {
    formattersCache.set(key, new Intl.NumberFormat('en-US', options));
  }
  return formattersCache.get(key)!;
}

export function formatPrice(price: number): string {
  const decimals = price >= 1 ? 2 : price >= 0.01 ? 4 : 6;
  return getFormatter(`price-${decimals}`, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
}

export function formatCompact(value: number): string {
  return getFormatter('compact', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatSupply(value: number, symbol: string): string {
  return `${getFormatter('supply', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)} ${symbol}`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatLatency(ms: number): string {
  return ms < 1 ? '<1ms' : `${Math.round(ms)}ms`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
}