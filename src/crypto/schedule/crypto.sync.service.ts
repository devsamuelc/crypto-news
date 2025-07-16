import { CoinGeckoService } from '@/coin-gecko/coin-gecko.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CryptoSyncService {
  private readonly logger = new Logger(CryptoSyncService.name);

  constructor(private readonly coinGecko: CoinGeckoService) {}

  private readonly trackedIds = ['bitcoin', 'ethereum', 'solana', 'dogecoin'];

  @Cron(CronExpression.EVERY_10_MINUTES)
  public async syncCryptos() {
    this.logger.log(`Sincronizando criptos...`);

    for (const coinId of this.trackedIds) {
      await this.coinGecko.getCoinMarketData({
        coinId,
        currency: 'usd',
      });
    }

    this.logger.log(
      `Sincronização concluída (${this.trackedIds.length} criptos)`,
    );
  }
}
