export class CryptoDto {
  id: string;

  name: string;

  symbol: string;

  currentValue: number;

  marketCap: number;

  variation24h: number;

  variation7d: number;

  highestValue: number;

  highestValueDate: Date;

  lowestValue: number;

  lowestValueDate: Date;

  updates: {
    timestamp: Date;

    price: number;

    marketCap: number;

    variation24h: number;

    variation7d: number;
  }[];
}
