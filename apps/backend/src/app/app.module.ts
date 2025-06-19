import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from '../lib/users/lib/users.module';
import { BudgetingModule } from '../lib/budgeting/budgeting.module';
import { LoggingModule } from './logging/logging.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CqrsModule.forRoot(),
    LoggingModule,
    UsersModule,
    BudgetingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
