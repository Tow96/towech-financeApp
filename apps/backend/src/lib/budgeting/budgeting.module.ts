import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// Domain
import { ICategoryRepository } from './common/Core/i-category-repository';

// Persistence
import { PostgresBudgetingRepository } from './common/Database/postgres-budgeting-repository';

// Common Services
import { BudgetingProvider } from './common/Database/budgeting.provider';

// Features
import { ManageCategoriesController } from './feature/manage-categories/manage-categories.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ManageCategoriesController],
  providers: [
    { provide: ICategoryRepository, useClass: PostgresBudgetingRepository },
    BudgetingProvider,
  ],
})
export class BudgetingModule {}
