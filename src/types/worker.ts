import type { CoinData, PriceUpdate } from './coin';

export interface WorkerStats {
  updatesPerSecond: number;
  isConnected: boolean;
  latency: number;
}

export type WorkerMessageIn = 
  | { type: 'ping' }
  | { type: 'refresh' };

export type WorkerMessageOut = 
  | { type: 'coins'; coins: CoinData[] }
  | { type: 'price'; update: PriceUpdate }
  | { type: 'stats'; updates: number }
  | { type: 'status'; connected: boolean }
  | { type: 'error'; message: string }
  | { type: 'pong'; timestamp: number };