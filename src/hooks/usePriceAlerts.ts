import { useState, useEffect, useCallback } from 'react';
import type { PriceAlert } from '@/types/alert';
import type { CoinData } from '@/types/coin';
import { useToast } from '@/context/ToastContext';

const ALERTS_KEY = 'crypto-alerts';

export function usePriceAlerts(coins: CoinData[]) {
  const { showToast } = useToast();

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(ALERTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist alerts
  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  // Check alerts against current prices
  useEffect(() => {
    if (coins.length === 0) return;

    const priceMap = new Map(coins.map((c) => [c.id, c.currentPrice]));

    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.triggered) return alert;

        const currentPrice = priceMap.get(alert.coinId);
        if (currentPrice === undefined) return alert;

        const shouldTrigger =
          (alert.type === 'above' && currentPrice >= alert.targetPrice) ||
          (alert.type === 'below' && currentPrice <= alert.targetPrice);

        if (shouldTrigger) {
          showToast(
            'info',
            `${alert.coinSymbol} is now ${alert.type} $${alert.targetPrice.toLocaleString()}`
          );

          // Request notification permission and show if granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Price Alert', {
              body: `${alert.coinSymbol} is now ${alert.type} $${alert.targetPrice.toLocaleString()}`,
              icon: '/favicon.svg',
            });
          }

          return { ...alert, triggered: true };
        }

        return alert;
      })
    );
  }, [coins, showToast]);

  const addAlert = useCallback(
    (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
      const newAlert: PriceAlert = {
        ...alert,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      setAlerts((prev) => [...prev, newAlert]);
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearTriggered = useCallback(() => {
    setAlerts((prev) => prev.filter((a) => !a.triggered));
  }, []);

  return { alerts, addAlert, removeAlert, clearTriggered };
}
