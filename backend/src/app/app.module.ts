import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from '../lib/users/lib/users.module';
import { BudgetingModule } from '../lib/budgeting/app/budgeting.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, BudgetingModule],
  controllers: [AppController],
})
export class AppModule {}
