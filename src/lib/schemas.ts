import { z } from 'zod';

export const CoinGeckoResponseSchema = z.array(
  z.object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    image: z.string().url(),
    current_price: z.number().nullable(),
    market_cap: z.number().nullable(),
    market_cap_rank: z.number().nullable(),
    total_volume: z.number().nullable(),
    price_change_percentage_24h: z.number().nullable(),
    circulating_supply: z.number().nullable(),
    sparkline_in_7d: z
      .object({
        price: z.array(z.number()),
      })
      .nullable(),
  })
);

export const BinanceTradeSchema = z.object({
  e: z.literal('trade'),
  s: z.string(),
  p: z.string(),
  T: z.number(),
});

export type CoinGeckoResponse = z.infer<typeof CoinGeckoResponseSchema>;
export type BinanceTrade = z.infer<typeof BinanceTradeSchema>;
