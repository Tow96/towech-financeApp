import { Controller, Get, Logger, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetBalanceResponse } from '@towech-financeapp/shared';

import { CurrentUser, User } from '@/lib/users';
import { GetBalanceWeekQuery } from '@/lib/stats/queries/get-balance-week';
import { GetBalanceDto } from '@/lib/stats/dto';

@Controller('stats')
export class StatsController {
  private readonly logger: Logger = new Logger(StatsController.name);

  constructor(private readonly queryBus: QueryBus) {}

  @Get('balance')
  async getWeeklyBalance(
    @CurrentUser() user: User,
    @Query() params: GetBalanceDto
  ): Promise<GetBalanceResponse> {
    this.logger.log(`Retrieving ${params.timeframe} balance stats for user ${user.id}`);

    return this.queryBus.execute(new GetBalanceWeekQuery(user.id));
  }
}
