import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.NODE_ENV === 'development' ? '*' : process.env.CLIENT,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // app.use(json({ limit: '50mb' }));
  // app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(process.env.APP_PORT ?? 3000);
}

void bootstrap();
