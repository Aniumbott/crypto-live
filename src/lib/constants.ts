export const CONFIG = {
  COINGECKO_API: import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
  BINANCE_WS: import.meta.env.VITE_BINANCE_WS_URL || 'wss://stream.binance.com:9443',
  RANKING_REFRESH: Number(import.meta.env.VITE_RANKING_REFRESH_INTERVAL) || 300000,
  STATS_INTERVAL: Number(import.meta.env.VITE_STATS_INTERVAL) || 1000,
  PING_INTERVAL: 5000,
  MAX_RECONNECT_DELAY: 30000,
  FLASH_DURATION: 500,
} as const;

export const THEME_KEY = 'theme';