import { useEffect, useRef, useCallback, useState, type MutableRefObject } from 'react';
import { formatPrice } from '@/lib/formatters';
import { CONFIG } from '@/lib/constants';
import { useToast } from '@/context/ToastContext';
import type { WorkerMessageOut, WorkerStats } from '@/types/worker';
import type { CoinData } from '@/types/coin';

interface UsePriceWorkerOptions {
  priceRefs: MutableRefObject<Map<string, HTMLSpanElement>>;
  // rowRefs removed as they are no longer needed for animation
}

export function usePriceWorker({ priceRefs }: UsePriceWorkerOptions) {
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

    // Update the text content directly
    priceEl.textContent = formatPrice(price);

    // Handle text color flash only
    if (direction !== 0) {
      const color = direction > 0 ? 'var(--color-success)' : 'var(--color-danger)';

      // Apply color immediately
      priceEl.style.color = color;
      priceEl.style.transition = 'none'; // Instant change

      const existingTimeout = timeoutsRef.current.get(symbol);
      if (existingTimeout) clearTimeout(existingTimeout);

      // Fade back to normal color
      const timeoutId = window.setTimeout(() => {
        priceEl.style.transition = 'color 500ms ease-out';
        priceEl.style.color = ''; // Revert to default text color
        timeoutsRef.current.delete(symbol);
      }, CONFIG.FLASH_DURATION);

      timeoutsRef.current.set(symbol, timeoutId);
    }
  }, [priceRefs]);

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

    const currentTimeouts = timeoutsRef.current;

    return () => {
      clearInterval(pingInterval);
      currentTimeouts.forEach((id) => clearTimeout(id));
      workerRef.current?.terminate();
    };
  }, [updatePrice, showToast]);

  const refresh = useCallback(() => {
    workerRef.current?.postMessage({ type: 'refresh' });
    showToast('info', 'Refreshing rankings...');
  }, [showToast]);

  return { coins, stats, refresh };
}