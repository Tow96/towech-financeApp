import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BalanceItem } from '@towech-financeapp/shared';

import { MAIN_SCHEMA_CONNECTION, mainSchema } from '@/lib/database';

// Query parameters
export class GetBalanceWeekQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetBalanceWeekQuery)
export class GetBalanceWeekHandler implements IQueryHandler<GetBalanceWeekQuery, BalanceItem[]> {
  constructor(
    @Inject(MAIN_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof mainSchema>
  ) {}

  execute(): Promise<BalanceItem[]> {
    // Hardcoded data for testing
    return Promise.resolve([
      { date: new Date('2025/09/29'), balance: 18600 },
      { date: new Date('2025/09/30'), balance: 30500 },
      { date: new Date('2025/10/1'), balance: 23700 },
      { date: new Date('2025/10/2'), balance: 15000 },
      { date: new Date('2025/10/3'), balance: 20900 },
      { date: new Date('2025/10/4'), balance: 21400 },
      { date: new Date('2025/10/5'), balance: 35000 },
    ]);
  }
}
