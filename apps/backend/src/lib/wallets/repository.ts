import { v4 as uuidV4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';

import { MAIN_SCHEMA_CONNECTION, mainSchema } from '@/lib/database';
import { WalletEntity } from './entity';

@Injectable()
export class WalletRepository {
  constructor(
    @Inject(MAIN_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof mainSchema>
  ) {}

  getAllUserWallets(userId: string): Promise<WalletEntity[]> {
    return this._db.select().from(mainSchema.Wallets).where(eq(mainSchema.Wallets.userId, userId));
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
