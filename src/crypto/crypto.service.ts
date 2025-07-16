import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CryptoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const cryptos = await this.prisma.crypto.findMany({
      orderBy: { marketCap: 'desc' },
    });

    return cryptos;
  }

  async findByName(name: string) {
    return this.prisma.crypto.findFirst({
      where: { name: name.toLowerCase() },
    });
  }

  async findUpdates(name: string) {
    const crypto = await this.findByName(name);

    if (!crypto) return null;

    return this.prisma.cryptoUpdate.findMany({
      where: { cryptoId: crypto.id },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }
}
