import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const allowedOrigin = ['http://localhost:5175', 'http://localhost:5174'];

  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
