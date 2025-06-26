import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from '../lib/users/lib/users.module';
import { BudgetingModule } from '../lib/budgeting/budgeting.module';
import { LoggingModule } from './logging/logging.module';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DistributionModule } from '../lib/distribution/distribution.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CqrsModule.forRoot(),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    LoggingModule,
    UsersModule,
    BudgetingModule,
    DistributionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
