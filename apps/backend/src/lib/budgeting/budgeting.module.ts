import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// Domain
import { ICategoryRepository } from './common/Core/i-category-repository';

// Database
import { PostgresCategoryRepository } from './common/Database/postgres-category-repository';

// Common Services
import { BudgetingProvider } from './common/Database/budgeting.provider';

// Features
import { ManageCategoriesController } from './feature/manage-categories/manage-categories.controller';
import { CreateCategoryHandler } from './feature/manage-categories/Commands/create-category.command';
import { ArchiveCategoryHandler } from './feature/manage-categories/Commands/archive-category.command';
import { RestoreCategoryHandler } from './feature/manage-categories/Commands/restore-category.command';
import { UpdateCategoryHandler } from './feature/manage-categories/Commands/update-category.command';
import { GetCategoryOwnerHandler } from './feature/manage-categories/Queries/get-category-owner.query';
import { GetUserCategoriesHandler } from './feature/manage-categories/Queries/get-user-categories.query';
import { AddSubCategoryHandler } from './feature/manage-categories/Commands/add-sub-category.command';
import { DeleteSubCategoryHandler } from './feature/manage-categories/Commands/delete-sub-category.command';
import { UpdateSubCategoryHandler } from './feature/manage-categories/Commands/update-sub-category.command';

@Module({
  imports: [ConfigModule],
  controllers: [ManageCategoriesController],
  providers: [
    // Common
    BudgetingProvider,
    { provide: ICategoryRepository, useClass: PostgresCategoryRepository },

    // Manage Categories
    ArchiveCategoryHandler,
    CreateCategoryHandler,
    RestoreCategoryHandler,
    UpdateCategoryHandler,
    GetCategoryOwnerHandler,
    GetUserCategoriesHandler,
    AddSubCategoryHandler,
    DeleteSubCategoryHandler,
    UpdateSubCategoryHandler,
  ],
})
export class BudgetingModule {}
