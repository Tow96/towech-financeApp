import { v4 as uuidV4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { eq, and, gte, lt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { MAIN_SCHEMA_CONNECTION, mainSchema } from '@/lib/database';
import { MovementEntity } from './entity';
import { SummaryDto } from '@/lib/movements/dto';

@Injectable()
export class MovementRepository {
  constructor(
    @Inject(MAIN_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof mainSchema>
  ) {}

  getByMonth(userId: string, year: number, month: number): Promise<MovementEntity[]> {
    return this._db.query.Movements.findMany({
      with: { summary: true },
      where: and(
        eq(mainSchema.Movements.userId, userId),
        gte(mainSchema.Movements.date, new Date(year, month)),
        lt(mainSchema.Movements.date, new Date(year, month + 1)) // Primitive handles year rollover
      ),
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
    categoryId: string,
    subCategoryId: string | null,
    description: string,
    date: Date,
    summary: SummaryDto[]
  ): Promise<string> {
    const id = uuidV4();

    await this._db.transaction(async tx => {
      await tx.insert(mainSchema.Movements).values({
        id,
        userId,
        categoryId,
        subCategoryId,
        description,
        date,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      for (const item of summary) {
        await tx.insert(mainSchema.MovementSummary).values({
          movementId: id,
          originWalletId: item.originWalletId,
          destinationWalletId: item.destinationWalletId,
          amount: item.amount,
        });
      }
    });

    return id;
  }

  async update(id: string, data: Partial<MovementEntity>): Promise<void> {
    await this._db
      .update(mainSchema.Movements)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(mainSchema.Movements.id, id));
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
