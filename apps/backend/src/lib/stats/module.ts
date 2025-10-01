import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/lib/database';

import { StatsController } from './controller';
import { GetBalanceWeekHandler } from '@/lib/stats/queries/get-balance-week';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, DatabaseModule],
  providers: [GetBalanceWeekHandler],
  controllers: [StatsController],
})
export class StatsModule {}
