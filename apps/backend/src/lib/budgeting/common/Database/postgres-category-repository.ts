// External packages
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { v4 as uuidV4 } from 'uuid';

// App packages

// Slice packages
import { ICategoryRepository } from '../Core/i-category-repository';
import { BUDGETING_SCHEMA_CONNECTION } from './budgeting.provider';
import { BudgetingSchema } from './budgeting.schema';

@Injectable()
export class PostgresCategoryRepository implements ICategoryRepository {
  private readonly _logger = new Logger(PostgresCategoryRepository.name);

  constructor(
    @Inject(BUDGETING_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof BudgetingSchema>
  ) {}

  async test(): Promise<string> {
    await this._db.insert(BudgetingSchema.categoriesTable).values({
      id: uuidV4(),
      userId: 'testing-user',
      parentId: null,
      iconId: 2,
      name: 'Test category',
      type: 'EXPENSE',
      createdAt: new Date(),
    });
    return 'pesto';
  }
}
