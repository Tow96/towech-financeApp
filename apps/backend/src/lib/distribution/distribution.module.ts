import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Common

// Features
import { CacheCategoriesListener } from './feature/cache-categories/cache-categories.listener';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [CacheCategoriesListener],
})
export class DistributionModule {}
