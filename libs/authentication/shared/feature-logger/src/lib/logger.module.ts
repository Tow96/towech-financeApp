/** logger.module.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Module that handles logging, it also sets up a middleware that assigns log-id's to all calls
 */
// Libraries
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
// Services
import { PidWinstonLogger } from './pid-winston.logger';
// Utils
import { LogIdMiddleware } from './utils/log-id.middleware';

@Module({
  providers: [PidWinstonLogger],
  exports: [PidWinstonLogger],
})
export class SharedFeaturesLoggerModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogIdMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
