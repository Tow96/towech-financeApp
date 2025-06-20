import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from '../lib/users/lib/users.module';
import { BudgetingModule } from '../lib/budgeting/budgeting.module';
import { LoggingModule } from './logging/logging.module';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CqrsModule.forRoot(),
    EventEmitterModule.forRoot(),
    LoggingModule,
    UsersModule,
    BudgetingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
