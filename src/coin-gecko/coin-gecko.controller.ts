import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoinGeckoService } from './coin-gecko-service';

@Controller('coin-gecko')
export class CoinGeckoController {
  constructor(private readonly coinGeckoService: CoinGeckoService) {}

  @Get('/:coinId/price')
  async getCoinMarketData(
    @Param('coinId') coinId: string,
    @Query() query: Record<string, string>,
  ): Promise<any> {
    const currency = query.currency || 'brl';

    return this.coinGeckoService.getCoinMarketData({ coinId, currency });
  }
}
