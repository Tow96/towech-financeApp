import { v4 as uuidV4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { eq, and, gte, lt, sql, or, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { MAIN_SCHEMA_CONNECTION, mainSchema } from '@/lib/database';
import { MovementEntity } from './entity';
import { ReportDto, SummaryDto } from '@/lib/movements/dto';
import { CategoryType } from '@/lib/categories/dto';

@Injectable()
export class MovementRepository {
  constructor(
    @Inject(MAIN_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof mainSchema>
  ) {}

  async getReport(userId: string, year: number): Promise<ReportDto[]> {
    const query = await this._db
      .select({
        categoryType: mainSchema.Movements.categoryType,
        categoryId: mainSchema.Movements.categoryId,
        categorySubId: mainSchema.Movements.categorySubId,
        total: sql<string>`SUM(
        ${mainSchema.MovementSummary.amount}
        )`,
      })
      .from(mainSchema.Movements)
      .leftJoin(
        mainSchema.MovementSummary,
        eq(mainSchema.Movements.id, mainSchema.MovementSummary.movementId)
      )
      .where(
        and(
          eq(mainSchema.Movements.userId, userId),
          gte(mainSchema.Movements.date, new Date(year, 0)),
          lt(mainSchema.Movements.date, new Date(year + 1, 0))
        )
      )
      .groupBy(
        mainSchema.Movements.categoryType,
        mainSchema.Movements.categoryId,
        mainSchema.Movements.categorySubId
      );

    return query.map(
      i =>
        ({
          year,
          amount: Number(i.total),
          category: {
            type: i.categoryType,
            id: i.categoryId,
            subId: i.categorySubId,
          },
        }) as ReportDto
    );
  }

  getByMonth(userId: string, year: number, month: number): Promise<MovementEntity[]> {
    return this._db.query.Movements.findMany({
      with: { summary: true },
      where: and(
        eq(mainSchema.Movements.userId, userId),
        gte(mainSchema.Movements.date, new Date(year, month - 1)),
        lt(mainSchema.Movements.date, new Date(year, month)) // Primitive handles year rollover
      ),
      orderBy: desc(mainSchema.Movements.date),
    });
  }

  async getById(id: string): Promise<MovementEntity | null> {
    const query = await this._db.query.Movements.findMany({
      with: { summary: true },
      where: eq(mainSchema.Movements.id, id),
    });

    return query.length > 0 ? query[0] : null;
  }

  async insert(
    userId: string,
    categoryType: CategoryType,
    categoryId: string | null,
    categorySubId: string | null,
    description: string,
    date: Date,
    summary: SummaryDto[]
  ): Promise<string> {
    const id = uuidV4();

    await this._db.transaction(async tx => {
      await tx.insert(mainSchema.Movements).values({
        id,
        userId,
        categoryType,
        categoryId,
        categorySubId,
        description,
        date,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      for (const item of summary) {
        await tx.insert(mainSchema.MovementSummary).values({
          movementId: id,
          amount: item.amount,
          originWalletId: item.wallet.originId,
          destinationWalletId: item.wallet.destinationId,
        });
      }
    });

    return id;
  }

  async delete(id: string): Promise<void> {
    await this._db.transaction(async tx => {
      await tx
        .delete(mainSchema.MovementSummary)
        .where(eq(mainSchema.MovementSummary.movementId, id));
      await tx.delete(mainSchema.Movements).where(eq(mainSchema.Movements.id, id));
    });
  }
}
