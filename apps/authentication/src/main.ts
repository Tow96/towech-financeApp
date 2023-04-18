/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
// Libraries
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
// Modules
import { AppModule } from './app/app.module';
import { WinstonModule } from 'nest-winston';
// Services
import { PidWinstonLogger } from '@towech-finance/shared/features/logger';
// Pipes

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: PidWinstonLogger.transports(),
    }),
  });
  // const configService = app.get(ConfigService);

  await app.listen(5000);
  Logger.log(`App running on port ${5000}`);
}

bootstrap();
