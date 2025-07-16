/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { Role } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { PrismaClient } from '@prisma/client';

type UserAndToken = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
};

const createUserAndLogin = async (
  app: INestApplication,
  options?: {
    role?: Role;
  },
): Promise<UserAndToken> => {
  const email = `user${uuid()}@example.com`;
  const password = 'teste123';
  const name = 'User Teste';

  const role = options?.role ?? 'USER';

  const { body: user } = await request(app.getHttpServer())
    .post('/users')
    .send({ email, password, name, role });

  const { body: tokens } = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password });

  return {
    accessToken: tokens.access_token,
    user,
  };
};

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let user: any;
  let accessToken: string;

  it('POST /users - deve criar um usuário', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Test User',
        email: `test+${Date.now()}@example.com`,
        password: '12345678',
      })
      .expect(201);

    user = res.body;
    expect(user).toHaveProperty('id');
  });

  it('POST /auth/login - autentica e retorna token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: '12345678' })
      .expect(201);

    accessToken = res.body.access_token;
    expect(accessToken).toBeDefined();
  });

  it('GET /users/me - deve retornar o perfil do usuário', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.email).toBe(user.email);
  });

  it('GET /users/:id - deve retornar o usuário por ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.id).toBe(user.id);
  });

  it('PUT /users/:id - deve atualizar o nome', async () => {
    const res = await request(app.getHttpServer())
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Updated Name' })
      .expect(200);

    expect(res.body.name).toBe('Updated Name');
  });

  it('DELETE /users/:id - nega delete sem role ADMIN', async () => {
    const { accessToken, user } = await createUserAndLogin(app, {
      role: 'USER',
    });

    return request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('DELETE /users/:id - nega delete sem autenticação', async () => {
    return request(app.getHttpServer()).delete(`/users/idqualquer`).expect(401);
  });

  it('DELETE /users/:id - permite delete com ADMIN', async () => {
    const { accessToken, user } = await createUserAndLogin(app, {
      role: 'ADMIN',
    });

    return request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  afterAll(async () => {
    await prisma.session.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'user+',
        },
      },
    });

    await prisma.$disconnect();
  });
});
