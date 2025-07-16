/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { PrismaService } from '@/prisma/prisma.service';
import { CoinGeckoApi } from '@/apis/coinGeckoApi';

interface IGetCoinMarketDataParams {
  coinId: string;
  currency: string;
}

@Injectable()
export class CoinGeckoService {
  constructor(private readonly prisma: PrismaService) {}

  async getCoinMarketData(params: IGetCoinMarketDataParams): Promise<any> {
    const { coinId, currency } = params;

    const cryptoApiKey = process.env.COIN_GECKO_API_KEY;

    if (!cryptoApiKey) {
      throw new Error('Crypto API key is not set');
    }

    const api = CoinGeckoApi();

    try {
      const response = await api.get(`/coins/markets`, {
        params: {
          ids: coinId,
          vs_currency: currency,
          price_change_percentage: '24h,7d',
        },
      });

      const data = response.data?.[0];

      if (!data) throw new Error('Invalid response from API');

      const upsertedCrypto = await this.prisma.crypto.upsert({
        where: { name: data.name.toLowerCase() },
        update: {
          currentValue: data.current_price,
          marketCap: data.market_cap,
          variation24h: data.price_change_percentage_24h,
          variation7d: data.price_change_percentage_7d_in_currency,
          highestValue: data.ath,
          highestValueDate: new Date(data.ath_date),
          lowestValue: data.atl,
          lowestValueDate: new Date(data.atl_date),
        },
        create: {
          name: data.name.toLowerCase(),
          symbol: data.symbol,
          currentValue: data.current_price,
          marketCap: data.market_cap,
          variation24h: data.price_change_percentage_24h,
          variation7d: data.price_change_percentage_7d_in_currency,
          highestValue: data.ath,
          highestValueDate: new Date(data.ath_date),
          lowestValue: data.atl,
          lowestValueDate: new Date(data.atl_date),
        },
      });

      await this.prisma.cryptoUpdate.create({
        data: {
          cryptoId: upsertedCrypto.id,
          price: data.current_price,
          marketCap: data.market_cap,
          variation24h: data.price_change_percentage_24h,
          variation7d: 0,
          ath: data.ath,
          athDate: new Date(data.ath_date),
          atl: data.atl,
          atlDate: new Date(data.atl_date),
        },
      });

      return data;
    } catch (error) {
      console.error('Error fetching or saving coin data:', error);

      throw new Error('Failed to fetch coin price');
    }
  }
}
