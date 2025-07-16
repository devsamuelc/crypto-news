import { Module } from '@nestjs/common';
import { CoinGeckoService } from './coin-gecko.service';
import { CoinGeckoController } from './coin-gecko.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [CoinGeckoController],
  providers: [CoinGeckoService, PrismaService, JwtService],
})
export class CoinGeckoModule {}
