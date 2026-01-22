import type { WorkerMessageIn, WorkerMessageOut } from '../types/worker';
import type { CoinData } from '../types/coin';

// State
let coins: CoinData[] = [];
const symbolMap = new Map<string, CoinData>();
const binanceMap = new Map<string, string>();
let ws: WebSocket | null = null;
let updateCount = 0;
let reconnectAttempts = 0;

const MAX_RECONNECT_DELAY = 30000;
const COINGECKO_URL = 'https://api.coingecko.com/api/v3';
const BINANCE_WS_URL = 'wss://stream.binance.com:9443';

function post(message: WorkerMessageOut) {
  self.postMessage(message);
}

// Stats reporter
setInterval(() => {
  post({ type: 'stats', updates: updateCount });
  updateCount = 0;
}, 1000);

async function fetchCoins(): Promise<CoinData[]> {
  try {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '10',
      page: '1',
      sparkline: 'true',
      price_change_percentage: '24h',
    });
    
    const res = await fetch(`${COINGECKO_URL}/coins/markets?${params}`);
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    
    const data = await res.json();
    
    return data.map((c: {
      id: string;
      symbol: string;
      name: string;
      image: string;
      current_price: number;
      market_cap: number;
      market_cap_rank: number;
      total_volume: number;
      price_change_percentage_24h: number;
      circulating_supply: number;
      sparkline_in_7d: { price: number[] };
    }) => ({
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      image: c.image,
      currentPrice: c.current_price ?? 0,
      marketCap: c.market_cap ?? 0,
      marketCapRank: c.market_cap_rank ?? 0,
      totalVolume: c.total_volume ?? 0,
      priceChangePercent24h: c.price_change_percentage_24h ?? 0,
      circulatingSupply: c.circulating_supply ?? 0,
      sparkline: c.sparkline_in_7d?.price ?? [],
    }));
  } catch (err) {
    post({ type: 'error', message: 'Failed to fetch coin data' });
    return [];
  }
}

function connectWebSocket(symbols: string[]) {
  if (ws) {
    ws.close();
    ws = null;
  }
  
  if (symbols.length === 0) return;
  
  binanceMap.clear();
  const streams: string[] = [];
  
  for (const symbol of symbols) {
    binanceMap.set(`${symbol}USDT`, symbol);
    streams.push(`${symbol.toLowerCase()}usdt@trade`);
  }
  
  const url = `${BINANCE_WS_URL}/stream?streams=${streams.join('/')}`;
  ws = new WebSocket(url);
  
  ws.onopen = () => {
    reconnectAttempts = 0;
    post({ type: 'status', connected: true });
  };
  
  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (!msg.data || msg.data.e !== 'trade') return;
      
      const symbol = binanceMap.get(msg.data.s);
      if (!symbol) return;
      
      const price = parseFloat(msg.data.p);
      if (isNaN(price)) return;
      
      const coin = symbolMap.get(symbol);
      if (!coin) return;
      
      const prevPrice = coin.currentPrice;
      if (prevPrice === price) return;
      
      const direction = price > prevPrice ? 1 : price < prevPrice ? -1 : 0;
      coin.currentPrice = price;
      updateCount++;
      
      post({
        type: 'price',
        update: { symbol, price, direction, timestamp: Date.now() },
      });
    } catch {
      // Ignore parse errors
    }
  };
  
  ws.onclose = () => {
    post({ type: 'status', connected: false });
    
    reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
    
    setTimeout(() => {
      if (coins.length > 0) {
        connectWebSocket(coins.map((c) => c.symbol));
      }
    }, delay);
  };
  
  ws.onerror = () => {
    ws?.close();
  };
}

async function initialize() {
  const newCoins = await fetchCoins();
  
  if (newCoins.length === 0) {
    setTimeout(initialize, 10000);
    return;
  }
  
  coins = newCoins;
  symbolMap.clear();
  coins.forEach((c) => symbolMap.set(c.symbol, c));
  
  post({ type: 'coins', coins });
  connectWebSocket(coins.map((c) => c.symbol));
}

async function refresh() {
  const newCoins = await fetchCoins();
  if (newCoins.length === 0) return;
  
  const oldSymbols = new Set(coins.map((c) => c.symbol));
  const newSymbols = new Set(newCoins.map((c) => c.symbol));
  
  const hasChanges = 
    newCoins.some((c) => !oldSymbols.has(c.symbol)) ||
    coins.some((c) => !newSymbols.has(c.symbol));
  
  coins = newCoins;
  symbolMap.clear();
  coins.forEach((c) => symbolMap.set(c.symbol, c));
  
  post({ type: 'coins', coins });
  
  if (hasChanges) {
    connectWebSocket(coins.map((c) => c.symbol));
  }
}

self.onmessage = (event: MessageEvent<WorkerMessageIn>) => {
  switch (event.data.type) {
    case 'ping':
      post({ type: 'pong', timestamp: Date.now() });
      break;
    case 'refresh':
      refresh();
      break;
  }
};

// Start
initialize();
setInterval(refresh, 5 * 60 * 1000);