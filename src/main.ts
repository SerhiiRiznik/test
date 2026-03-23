import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import AppModule from './app.module';
import { DEFAULT_PORT } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Anonimizer Backend API')
    .setDescription(
      'API documentation for the backend of out data anonimizer app',
    )
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const configService = new ConfigService();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(configService.getOrThrow<number>('PORT') ?? DEFAULT_PORT);
}

bootstrap().catch(() => {
  process.exit(1);
});
