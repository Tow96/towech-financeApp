import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/lib/database';

import { CategoryController } from './controller';
import { CategoryRepository } from './repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
