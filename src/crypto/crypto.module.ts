import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CryptoController } from './crypto.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { CryptoSyncService } from './schedule/crypto.sync.service';
import { CoinGeckoService } from '@/coin-gecko/coin-gecko.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CryptoController],
  providers: [
    CryptoService,
    PrismaService,
    CryptoSyncService,
    CoinGeckoService,
    JwtService,
  ],
})
export class CryptoModule {}
