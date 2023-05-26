import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PidWinstonLogger } from './pid-winston.logger';
import { LogIdMiddleware } from './log-id.middleware';

@Module({
  providers: [PidWinstonLogger],
  exports: [PidWinstonLogger],
})
export class SharedFeaturesLoggerModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogIdMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
