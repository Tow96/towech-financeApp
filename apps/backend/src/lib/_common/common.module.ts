// External libraries
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Slice packages
import { CommonProvider } from './common.provider';
import { ICategoryRepository } from './categories';
import { PostgresCategoryRepository } from './categories/database/postgres-category-repository';

@Module({
  imports: [ConfigModule],
  providers: [
    CommonProvider,
    { provide: ICategoryRepository, useClass: PostgresCategoryRepository },
  ],
  exports: [ICategoryRepository],
})
export class CommonModule {}
