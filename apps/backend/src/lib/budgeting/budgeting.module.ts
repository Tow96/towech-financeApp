import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// Domain
import { ICategoryRepository } from './common/Core/i-category-repository';

// Persistence
import { PostgresCategoryRepository } from './common/Database/postgres-category-repository';

// Common Services
import { BudgetingProvider } from './common/Database/budgeting.provider';

// Features
import { ManageCategoriesController } from './feature/manage-categories/manage-categories.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ManageCategoriesController],
  providers: [
    { provide: ICategoryRepository, useClass: PostgresCategoryRepository },
    BudgetingProvider,
  ],
})
export class BudgetingModule {}
