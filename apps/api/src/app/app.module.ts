import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { RabbitMqService } from './rabbitMQ.service';
import { CheckAuthMiddleware, CheckRefreshMiddleware } from '../utils/middlewares';
import { CategoryController } from './categories.controller';

@Module({
  imports: [],
  controllers: [AuthenticationController, CategoryController],
  providers: [RabbitMqService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckRefreshMiddleware)
      .forRoutes('authentication/refresh', 'authentication/logout', 'authentication/logout-all');

    consumer.apply(CheckAuthMiddleware).forRoutes('categories');
  }
}
