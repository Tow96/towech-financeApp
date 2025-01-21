import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CorrelationIdMiddleware } from './Middleware/CorrelationId.Middleware';
import { HttpLogMiddleware } from './Middleware/Http.Middleware';
import { PinoModule } from './Pino.Module';

@Module({
  imports: [PinoModule],
})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    consumer.apply(HttpLogMiddleware).forRoutes('*');
  }
}
