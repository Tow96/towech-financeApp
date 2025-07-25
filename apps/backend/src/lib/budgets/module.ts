import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/lib/database';

import { BudgetController } from './controller';
import { BudgetRepository } from './repository';
import { MovementModule } from '@/lib/movements';

@Module({
  imports: [DatabaseModule, MovementModule],
  controllers: [BudgetController],
  providers: [BudgetRepository],
})
export class BudgetsModule {}
