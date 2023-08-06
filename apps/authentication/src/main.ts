/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
// Libraries
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
// Modules
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app/app.module';
// Services
import { AuthenticationPidWinstonLogger } from '@finance/authentication/shared/feature-logger';
import { ConfigService } from '@nestjs/config';
// Pipes
import { AuthenticationTrimPipe } from '@finance/authentication/core/utils-pipes';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: AuthenticationPidWinstonLogger.transports(),
    }),
  });
  const configService = app.get(ConfigService);
  const isProd = configService.get('NODE_ENV') === 'production';

  // Adds the body trimming pipe
  app.useGlobalPipes(new AuthenticationTrimPipe());

  // TODO: i18n update when it is ready
  app.useGlobalPipes(new I18nValidationPipe({ transform: true }));
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: true, errorHttpStatusCode: 422 })
  );

  // CORS
  app.enableCors({
    origin: !isProd ? 'http://localhost:4200' : configService.get('CORS_ORIGIN'),
    credentials: true,
    methods: ['POST'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Towech Finance Auth Service')
    .setDescription('MicroService that is in charge of handling users and authentication')
    .setVersion('2.0')
    .addBearerAuth(
      {
        description: `Please enter the JWT token`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token'
    )
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDoc);

  app.use(cookieParser());
  await app.listen(configService.get('PORT'));
  Logger.log(`App running on port ${configService.get('PORT')}`);
}

bootstrap();
