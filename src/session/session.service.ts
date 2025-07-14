import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, refreshToken: string, userAgent?: string, ip?: string) {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 dias

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
