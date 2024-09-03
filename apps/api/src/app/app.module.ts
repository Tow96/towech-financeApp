import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { RabbitMqService } from './rabbitMQ.service';
import { CheckRefreshMiddleware } from '../utils/middlewares';

@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [RabbitMqService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckRefreshMiddleware)
      .forRoutes('authentication/refresh', 'authentication/logout', 'authentication/logout-all');
  }
}
