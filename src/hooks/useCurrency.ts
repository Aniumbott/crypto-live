import { useState, useEffect, useCallback } from 'react';

export type Currency = 'usd' | 'eur' | 'gbp' | 'jpy' | 'btc' | 'eth';

const CURRENCY_KEY = 'preferred-currency';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  usd: '$',
  eur: '€',
  gbp: '£',
  jpy: '¥',
  btc: '₿',
  eth: 'Ξ',
};

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === 'undefined') return 'usd';
    return (localStorage.getItem(CURRENCY_KEY) as Currency) || 'usd';
  });

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  const symbol = CURRENCY_SYMBOLS[currency];

  const changeCurrency = useCallback((newCurrency: Currency) => {
    setCurrency(newCurrency);
  }, []);

  return { currency, symbol, changeCurrency };
}
