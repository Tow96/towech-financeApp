import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

// Modules
import { LoggingModule } from './logging/logging.module';
import { UsersModule } from '@/lib/users';
import { CategoryModule } from '@/lib/categories';
import { WalletModule } from '@/lib/wallets';
import { MovementModule } from '@/lib/movements';
import { BudgetsModule } from '@/lib/budgets';
import {StatsModule} from '@/lib/stats/module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CqrsModule.forRoot(),
    LoggingModule,
    UsersModule,
    CategoryModule,
    WalletModule,
    MovementModule,
    BudgetsModule,
    StatsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
