import { Module } from '@nestjs/common';
import { SessionService } from '@/session/session.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SessionController } from './session.controller';

@Module({
  providers: [SessionService, PrismaService],
  controllers: [SessionController]
})
export class SessionModule {}
