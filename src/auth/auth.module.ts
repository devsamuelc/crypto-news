import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { SessionService } from '@/session/session.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [AuthService, JwtService, UserService, SessionService, PrismaService],
  controllers: [AuthController]
})
export class AuthModule {}
