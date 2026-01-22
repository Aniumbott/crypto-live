import { useEffect, useRef, useCallback, useState, type MutableRefObject } from 'react';
import { formatPrice } from '@/lib/formatters';
import { CONFIG } from '@/lib/constants';
import { useToast } from '@/context/ToastContext';
import type { WorkerMessageOut, WorkerStats } from '@/types/worker';
import type { CoinData } from '@/types/coin';

interface UsePriceWorkerOptions {
  priceRefs: MutableRefObject<Map<string, HTMLSpanElement>>;
  rowRefs: MutableRefObject<Map<string, HTMLTableRowElement>>;
}

export function usePriceWorker({ priceRefs, rowRefs }: UsePriceWorkerOptions) {
  const workerRef = useRef<Worker | null>(null);
  const timeoutsRef = useRef<Map<string, number>>(new Map());
  const lastPingRef = useRef<number>(0);
  const wasConnectedRef = useRef(false);
  
  const { showToast } = useToast();
  
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [stats, setStats] = useState<WorkerStats>({
    updatesPerSecond: 0,
    isConnected: false,
    latency: 0,
  });
  
  const updatePrice = useCallback((symbol: string, price: number, direction: 1 | -1 | 0) => {
    const priceEl = priceRefs.current.get(symbol);
    if (!priceEl) return;
    
    priceEl.textContent = formatPrice(price);
    
    if (direction !== 0) {
      const color = direction > 0 ? 'var(--color-success)' : 'var(--color-danger)';
      priceEl.style.color = color;
      
      const row = rowRefs.current.get(symbol);
      if (row) {
        row.classList.remove('flash-up', 'flash-down');
        void row.offsetWidth; // Force reflow
        row.classList.add(direction > 0 ? 'flash-up' : 'flash-down');
      }
      
      const existingTimeout = timeoutsRef.current.get(symbol);
      if (existingTimeout) clearTimeout(existingTimeout);
      
      const timeoutId = window.setTimeout(() => {
        priceEl.style.color = '';
        timeoutsRef.current.delete(symbol);
      }, CONFIG.FLASH_DURATION);
      
      timeoutsRef.current.set(symbol, timeoutId);
    }
  }, [priceRefs, rowRefs]);
  
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/price.worker.ts', import.meta.url),
      { type: 'module' }
    );
    
    workerRef.current.onmessage = (event: MessageEvent<WorkerMessageOut>) => {
      const msg = event.data;
      
      switch (msg.type) {
        case 'coins':
          setCoins(msg.coins);
          break;
          
        case 'price':
          updatePrice(msg.update.symbol, msg.update.price, msg.update.direction);
          break;
          
        case 'stats':
          setStats((prev) => ({ ...prev, updatesPerSecond: msg.updates }));
          break;
          
        case 'status':
          setStats((prev) => ({ ...prev, isConnected: msg.connected }));
          if (msg.connected && !wasConnectedRef.current) {
            showToast('success', 'Connected to live price feed');
          } else if (!msg.connected && wasConnectedRef.current) {
            showToast('error', 'Disconnected from price feed. Reconnecting...');
          }
          wasConnectedRef.current = msg.connected;
          break;
          
        case 'error':
          showToast('error', msg.message);
          break;
          
        case 'pong':
          setStats((prev) => ({ ...prev, latency: Date.now() - lastPingRef.current }));
          break;
      }
    };
    
    const pingInterval = setInterval(() => {
      if (workerRef.current) {
        lastPingRef.current = Date.now();
        workerRef.current.postMessage({ type: 'ping' });
      }
    }, CONFIG.PING_INTERVAL);
    
    return () => {
      clearInterval(pingInterval);
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      workerRef.current?.terminate();
    };
  }, [updatePrice, showToast]);
  
  const refresh = useCallback(() => {
    workerRef.current?.postMessage({ type: 'refresh' });
    showToast('info', 'Refreshing rankings...');
  }, [showToast]);
  
  return { coins, stats, refresh };
}