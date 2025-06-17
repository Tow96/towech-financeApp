import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Logging
  app.useLogger(app.get(PinoLogger));

  // CORS
  const corsOrigin = process.env.CORS_ORIGIN;
  if (corsOrigin !== undefined) {
    app.enableCors({
      origin: corsOrigin,
      methods: 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      credentials: true,
    });
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch(e => console.error(e));
