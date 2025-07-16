/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaClient } from '@prisma/client';

describe('CryptoController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let accessToken: string;

  beforeAll(async () => {
    prisma = new PrismaClient();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const email = `user+${Date.now()}@example.com`;
    const password = 'test1234';

    await request(app.getHttpServer())
      .post('/users')
      .send({ email, password, name: 'Tester' });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    accessToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await prisma.cryptoUpdate.deleteMany();
    await prisma.crypto.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: { contains: 'user+' },
      },
    });
    await prisma.$disconnect();
    await app.close();
  });

  it('GET /cryptos - retorna lista de criptos', async () => {
    await request(app.getHttpServer())
      .get('/cryptos')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('GET /cryptos/:name - retorna uma cripto existente', async () => {
    const crypto = await prisma.crypto.create({
      data: {
        name: 'samukacoin',
        symbol: 'smc',
        marketCap: 100000,
        currentValue: 50000,
        highestValue: 60000,
        highestValueDate: new Date(),
        lowestValue: 30000,
        lowestValueDate: new Date(),
        variation24h: 2.5,
        variation7d: 10.2,
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/cryptos/${crypto.name}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.name).toBe('samukacoin');
  });

  it('GET /cryptos/:name - retorna 404 para cripto inexistente', async () => {
    await request(app.getHttpServer())
      .get('/cryptos/nãoexistente')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('GET /cryptos/:name/updates - retorna atualizações se existirem', async () => {
    const crypto = await prisma.crypto.findFirst({
      where: { name: 'samukacoin' },
    });

    await prisma.cryptoUpdate.create({
      data: {
        cryptoId: crypto!.id,
        marketCap: 120000,
        price: 50500,
        variation24h: 1.2,
        variation7d: 4.4,
        ath: 60000,
        athDate: new Date(),
        atl: 1000,
        atlDate: new Date(),
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/cryptos/samukacoin/updates`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('price');
  });

  it('GET /cryptos/:name/updates - retorna 404 se não houver updates', async () => {
    await request(app.getHttpServer())
      .get('/cryptos/nãoexistente/updates')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
