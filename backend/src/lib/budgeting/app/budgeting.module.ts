import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ManageCategoriesController } from './feature/manage-categories/manage-categories.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ManageCategoriesController],
})
export class BudgetingModule {}
