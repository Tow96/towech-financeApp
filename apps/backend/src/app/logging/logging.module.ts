import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { HttpLogMiddleware } from './middleware/http.middleware';
import { PinoModule } from './pino.module';

@Module({
  imports: [PinoModule],
})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('{*splat}');
    consumer.apply(HttpLogMiddleware).forRoutes('{*splat}');
  }
}
