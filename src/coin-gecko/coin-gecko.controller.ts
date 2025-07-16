import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CoinGeckoService } from './coin-gecko.service';
import { JwtAuthGuard } from '@/auth/jwt/jwt.auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('CoinGecko')
@Controller('coin-gecko')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
