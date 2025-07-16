import { Module } from '@nestjs/common';
import { CategoryController } from '@/lib/categories/controller';
import { DatabaseModule } from '@/lib/database';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
})
export class CategoryModule {}
