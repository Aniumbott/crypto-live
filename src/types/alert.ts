export interface PriceAlert {
  id: string;
  coinId: string;
  coinSymbol: string;
  type: 'above' | 'below';
  targetPrice: number;
  createdAt: number;
  triggered?: boolean;
}
