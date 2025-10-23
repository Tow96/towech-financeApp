import { v4 as uuidV4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, sql, or, lt } from 'drizzle-orm';

import { MAIN_SCHEMA_CONNECTION, mainSchema } from '@/lib/database';
import { WalletEntity } from './entity';
import { WalletDto } from './dto';

@Injectable()
export class WalletRepository {
  constructor(
    @Inject(MAIN_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof mainSchema>
  ) {}

  async getAllUserWallets(userId: string): Promise<WalletDto[]> {
    const res = await this._db
      .select({
        id: mainSchema.Wallets.id,
        iconId: mainSchema.Wallets.iconId,
        name: mainSchema.Wallets.name,
        archivedAt: mainSchema.Wallets.archivedAt,
        money: sql<string>`SUM(CASE WHEN ${mainSchema.MovementSummary.destinationWalletId} = ${mainSchema.Wallets.id} THEN ${mainSchema.MovementSummary.amount} ELSE 0 END) - SUM(CASE WHEN ${mainSchema.MovementSummary.originWalletId} = ${mainSchema.Wallets.id} THEN ${mainSchema.MovementSummary.amount} ELSE 0 END)`,
      })
      .from(mainSchema.Wallets)
      .leftJoin(
        mainSchema.MovementSummary,
        or(
          eq(mainSchema.MovementSummary.originWalletId, mainSchema.Wallets.id),
          eq(mainSchema.MovementSummary.destinationWalletId, mainSchema.Wallets.id)
        )
      )
      .leftJoin(
        mainSchema.Movements,
        eq(mainSchema.Movements.id, mainSchema.MovementSummary.movementId)
      )
      .where(and(eq(mainSchema.Wallets.userId, userId)))
      .groupBy(mainSchema.Wallets.id)
      .orderBy(mainSchema.Wallets.name);

    return res.map(
      i =>
        ({
          id: i.id,
          archived: !!i.archivedAt,
          iconId: i.iconId,
          name: i.name,
          money: Number(i.money),
        }) as WalletDto
    );
  }

  async getWalletById(id: string): Promise<WalletEntity | null> {
    const query: WalletEntity[] = await this._db
      .select()
      .from(mainSchema.Wallets)
      .where(eq(mainSchema.Wallets.id, id));

    return query.length > 0 ? query[0] : null;
  }

  async getWalletIdByName(userId: string, name: string): Promise<string | null> {
    const query = await this._db
      .select({ id: mainSchema.Wallets.id })
      .from(mainSchema.Wallets)
      .where(and(eq(mainSchema.Wallets.userId, userId), eq(mainSchema.Wallets.name, name)));

    return query.length > 0 ? query[0].id : null;
  }

  async insertWallet(userId: string, iconId: number, name: string): Promise<string> {
    const id = uuidV4();
    await this._db.insert(mainSchema.Wallets).values({
      id,
      userId,
      iconId,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return id;
  }

  async updateWallet(id: string, data: Partial<WalletEntity>): Promise<void> {
    await this._db
      .update(mainSchema.Wallets)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(mainSchema.Wallets.id, id));
  }
}
