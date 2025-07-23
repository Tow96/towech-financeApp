import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/lib/database';

import { BudgetController } from './controller';
import { BudgetRepository } from './repository';

@Module({
  imports: [DatabaseModule],
  controllers: [BudgetController],
  providers: [BudgetRepository],
})
export class BudgetsModule {}
