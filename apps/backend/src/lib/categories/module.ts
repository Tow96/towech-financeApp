import { Module } from '@nestjs/common';
import { CategoryController } from '@/lib/categories/controller';

@Module({
  controllers: [CategoryController],
})
export class CategoryModule {}
