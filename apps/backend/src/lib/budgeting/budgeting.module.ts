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
import { CreateCategoryHandler } from './feature/manage-categories/Commands/create-category.command';

@Module({
  imports: [ConfigModule],
  controllers: [ManageCategoriesController],
  providers: [
    // Common
    BudgetingProvider,
    { provide: ICategoryRepository, useClass: PostgresCategoryRepository },

    // Manage Categories
    CreateCategoryHandler,
  ],
})
export class BudgetingModule {}
