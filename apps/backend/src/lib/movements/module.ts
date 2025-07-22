import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/lib/database';
import { CategoryModule } from '@/lib/categories';

import { MovementController } from './controller';
import { MovementRepository } from './repository';

@Module({
  imports: [DatabaseModule, CategoryModule],
  controllers: [MovementController],
  providers: [MovementRepository],
})
export class MovementModule {}
