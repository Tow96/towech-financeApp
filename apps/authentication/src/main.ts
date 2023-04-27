/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
// Libraries
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
// Modules
import { AppModule } from './app/app.module';
import { WinstonModule } from 'nest-winston';
// Services
import { PidWinstonLogger } from '@towech-finance/shared/features/logger';
import { ConfigService } from '@nestjs/config';
// Pipes
import { ValidationPipe } from '@nestjs/common';
import { TrimPipe } from '@towech-finance/shared/utils/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: PidWinstonLogger.transports(),
    }),
  });
  const configService = app.get(ConfigService);

  // Adds the body trimming pipe
  app.useGlobalPipes(new TrimPipe());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // TODO: i18n

  // TODO: CORS

  // TODO: Swagger

  app.use(cookieParser());
  await app.listen(configService.get('PORT'));
  Logger.log(`App running on port ${configService.get('PORT')}`);
}

bootstrap();
