import { v4 as uuidV4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { MAIN_SCHEMA_CONNECTION, mainSchema } from '@/lib/database';
import { BudgetEntity, BudgetSummaryValueObject } from './entity';

@Injectable()
export class BudgetRepository {
  constructor(
    @Inject(MAIN_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof mainSchema>
  ) {}

  getAll(userId: string): Promise<BudgetEntity[]> {
    return this._db.query.Budgets.findMany({
      with: { summary: true },
      where: eq(mainSchema.Budgets.userId, userId),
    });
  }

  async getById(id: string): Promise<BudgetEntity | null> {
    const query = await this._db.query.Budgets.findMany({
      with: { summary: true },
      where: eq(mainSchema.Budgets.id, id),
    });

    return query.length > 0 ? query[0] : null;
  }

  async getIdByYear(userId: string, year: number): Promise<string | null> {
    const query = await this._db
      .select({ id: mainSchema.Budgets.id })
      .from(mainSchema.Budgets)
      .where(and(eq(mainSchema.Budgets.userId, userId), eq(mainSchema.Budgets.year, year)));

    return query.length > 0 ? query[0].id : null;
  }

  async insert(
    userId: string,
    year: number,
    name: string,
    summary: BudgetSummaryValueObject[]
  ): Promise<string> {
    const id = uuidV4();

    await this._db.transaction(async tx => {
      await tx.insert(mainSchema.Budgets).values({
        id,
        userId,
        year,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      for (const item of summary) {
        await tx.insert(mainSchema.BudgetSummary).values({
          budgetId: id,
          month: item.month,
          categoryType: item.categoryType,
          categoryId: item.categoryId,
          categorySubId: item.categorySubId,
          limit: item.limit,
        });
      }
    });

    return id;
  }

  async delete(id: string): Promise<void> {
    await this._db.transaction(async tx => {
      await tx.delete(mainSchema.BudgetSummary).where(eq(mainSchema.BudgetSummary.budgetId, id));
      await tx.delete(mainSchema.Budgets).where(eq(mainSchema.Budgets.id, id));
    });
  }
}
