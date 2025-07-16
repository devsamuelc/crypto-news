import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoinGeckoModule } from './coin-gecko/coin-gecko.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfiguration } from './env/env.configuration';
import { SessionModule } from './session/session.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CryptoModule } from './crypto/crypto.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

const env = EnvConfiguration.getInstance();

@Module({
  imports: [
    PassportModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: env.redis.host,
      port: env.redis.port,
    }),
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: env.authentication.secret,
      signOptions: { expiresIn: '6h' },
    }),
    CoinGeckoModule,
    UserModule,
    SessionModule,
    AuthModule,
    CryptoModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
