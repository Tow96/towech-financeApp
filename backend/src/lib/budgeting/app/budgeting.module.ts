import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReadCategoriesController } from './feature/read-categories/read-categories.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ReadCategoriesController],
})
export class BudgetingModule {}
