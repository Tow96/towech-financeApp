import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { RabbitMqService } from './rabbitMQ.service';
import { CheckAdminMiddleware, CheckAuthMiddleware, CheckRefreshMiddleware } from '../utils/middlewares';
import { CategoryController } from './categories.controller';
import { UserController } from './users.controller';

@Module({
  imports: [],
  controllers: [AuthenticationController, CategoryController, UserController],
  providers: [RabbitMqService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckRefreshMiddleware)
      .forRoutes('authentication/refresh', 'authentication/logout', 'authentication/logout-all');

    consumer
      .apply(CheckAuthMiddleware)
      .exclude('users/reset', 'users/reset/:token')
      .forRoutes('categories', 'users/password', 'users/email', 'users/:id');

    consumer
      .apply(CheckAdminMiddleware)
      .exclude('users/password', 'users/email', 'users/:id', 'users/reset', 'users/reset/:token')
      .forRoutes('users/', 'users/register');
  }
}
