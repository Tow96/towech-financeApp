import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { RabbitMqService } from './rabbitMQ.service';
import {
  CheckAdminMiddleware,
  CheckAuthMiddleware,
  CheckConfirmedMiddleware,
  CheckRefreshMiddleware,
} from './utils/middlewares';
import { CategoryController } from './categories.controller';
import { UserController } from './users.controller';
import { TransactionController } from './transactions.controller';
import { WalletController } from './wallets.controller';

@Module({
  imports: [],
  controllers: [AuthenticationController, CategoryController, UserController, TransactionController, WalletController],
  providers: [RabbitMqService],
})
export class LegacyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckRefreshMiddleware)
      .forRoutes('authentication/refresh', 'authentication/logout', 'authentication/logout-all');

    consumer
      .apply(CheckAdminMiddleware)
      .exclude('users/password', 'users/email', 'users/:id', 'users/reset', 'users/reset/:token')
      .forRoutes('users/', 'users/register');

    consumer
      .apply(CheckAuthMiddleware)
      .exclude('users/reset', 'users/reset/:token')
      .forRoutes('categories', 'users/password', 'users/email', 'users/:id', 'transactions', 'wallets');

    consumer.apply(CheckConfirmedMiddleware).forRoutes('transactions', 'wallets');
  }
}
