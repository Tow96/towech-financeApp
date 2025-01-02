/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger } from '@nestjs/common';
import { Logger as PinoLogger } from '@financeApp/backend-infrastructure-logging';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './App.Module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(PinoLogger));

  const port = process.env.PORT || 3000;
  const corsOrigin = process.env.CORS_ORIGIN;

  if (process.env.ENABLE_CORS === 'true') {
    app.enableCors({
      origin: corsOrigin,
      methods: 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      credentials: true,
    });
  }

  app.use(cookieParser());
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}}`);
}

bootstrap();
