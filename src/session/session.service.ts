import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Session } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ip?: string,
  ): Promise<Session> {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    return this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        userAgent,
        ip,
        expiresAt,
      },
    });
  }

  async findValidSession(userId: string, userAgent?: string, ip?: string) {
    return this.prisma.session.findFirst({
      where: {
        userId,
        userAgent,
        ip,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async findByToken(refreshToken: string) {
    return this.prisma.session.findUnique({
      where: { refreshToken },
    });
  }

  async deleteByToken(refreshToken: string) {
    return this.prisma.session.deleteMany({
      where: { refreshToken },
    });
  }

  async deleteById(id: string) {
    return this.prisma.session.delete({
      where: { id },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteAllByUser(userId: string) {
    await this.prisma.session.deleteMany({ where: { userId } });
  }
}
