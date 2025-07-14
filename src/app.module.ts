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

const env = EnvConfiguration.getInstance();

console.log(env.authentication);

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.authentication.secret,
      signOptions: { expiresIn: '6h' },
    }),
    CoinGeckoModule, 
    UserModule,
    SessionModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
