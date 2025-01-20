import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerModule } from 'nestjs-pino';

import {
  CORRELATION_ID_HEADER,
  CorrelationIdMiddleware,
} from './Middleware/CorrelationId.Middleware';
import { PrettyTransport } from './Transports/Pretty.Transport';
import { HttpLogMiddleware } from './Middleware/Http.Middleware';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env['NODE_ENV'] === 'development' ? PrettyTransport : undefined,
        level: process.env['NODE_ENV'] === 'development' ? 'trace' : 'info',
        messageKey: 'message',
        customProps: (req) => ({ correlationId: req.headers[CORRELATION_ID_HEADER] }),
        autoLogging: false,
        serializers: {
          req: () => undefined,
          res: () => undefined,
        },
      },
    }),
  ],
})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    consumer.apply(HttpLogMiddleware).forRoutes('*');
  }
}
