import { Module } from '@nestjs/common';
import { SessionService } from '@/session/session.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SessionController } from './session.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [SessionService, PrismaService, JwtService],
  controllers: [SessionController],
})
export class SessionModule {}
