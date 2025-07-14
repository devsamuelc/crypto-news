import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfiguration } from './env/env.configuration';
import { RolesGuard } from './auth/roles/roles.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const env = EnvConfiguration.getInstance();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  app.useGlobalGuards(new RolesGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('Crypto API')
    .setDescription('Auth + Session + User API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.server.port ?? 3000);
}

bootstrap();
