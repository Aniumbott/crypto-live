export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  totalVolume: number;
  priceChangePercent24h: number;
  circulatingSupply: number;
  sparkline: number[];
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  direction: 1 | -1 | 0;
  timestamp: number;
}