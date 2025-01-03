/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger } from '@nestjs/common';
import { Logger as PinoLogger } from '@financeApp/backend-infrastructure-logging';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './App.Module';
import { HttpExceptionFilter } from './Filters/HttpException.Filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Logging
  app.useLogger(app.get(PinoLogger));

  // ErrorHandling
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  const corsOrigin = process.env.CORS_ORIGIN;
  if (process.env.ENABLE_CORS === 'true') {
    app.enableCors({
      origin: corsOrigin,
      methods: 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      credentials: true,
    });
  }

  // Cookies
  app.use(cookieParser());

  // Launch app
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}}`);
}

bootstrap();
