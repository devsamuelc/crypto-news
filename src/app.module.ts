import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoinGeckoModule } from './coin-gecko/coin-gecko.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [CoinGeckoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
