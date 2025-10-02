import { Controller, Get, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetBalanceWeekResponse } from '@towech-financeapp/shared';

import { CurrentUser, User } from '@/lib/users';
import { GetBalanceWeekQuery } from '@/lib/stats/queries/get-balance-week';

@Controller('stats')
export class StatsController {
  private readonly logger: Logger = new Logger(StatsController.name);

  constructor(private readonly queryBus: QueryBus) {}

  @Get('balance/week')
  async getWeeklyBalance(@CurrentUser() user: User): Promise<GetBalanceWeekResponse> {
    this.logger.log(`Retrieving weekly balance stats for user ${user.id}`);

    return this.queryBus.execute(new GetBalanceWeekQuery(user.id));
  }
}
