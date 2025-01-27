import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RabbitMqService } from './rabbitMQ.service';
import { CheckAuthMiddleware, CheckConfirmedMiddleware } from './utils/middlewares';
import { CategoryController } from './categories.controller';
import { TransactionController } from './transactions.controller';
import { WalletController } from './wallets.controller';

@Module({
  imports: [],
  controllers: [CategoryController, TransactionController, WalletController],
  providers: [RabbitMqService],
})
export class LegacyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckAuthMiddleware).forRoutes('categories', 'transactions', 'wallets');

    consumer.apply(CheckConfirmedMiddleware).forRoutes('transactions', 'wallets');
  }
}
