import { Module } from '@nestjs/common';
import { CoinGeckoService } from './coin-gecko.service';
import { CoinGeckoController } from './coin-gecko.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CoinGeckoController],
  providers: [CoinGeckoService, PrismaService],
})
export class CoinGeckoModule {}
