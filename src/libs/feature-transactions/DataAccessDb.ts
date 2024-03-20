/** DataAccessDb.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Class that wrap the db connection for the wallets and the transactions
 * When cache is implemented, it should also be handled here
 */
// Libraries ------------------------------------------------------------------
import { ObjectId } from 'bson';
import { SQL, and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { dbClient } from '@/utils';
// Schemas --------------------------------------------------------------------
import * as schema from './Schema';
const walletsTable = schema.walletsTable;

export class TransactionsDb {
  private connection = drizzle(dbClient, { schema });
  private basicWalletFilter = (extra?: SQL) => and(eq(walletsTable.deleted, false), extra);

  addWallet = async (userId: string, wallet: schema.InsertWallet): Promise<schema.Wallet> => {
    const id = new ObjectId().toString();

    const newWallets = await this.connection.insert(walletsTable).values({
      ...wallet,
      id,
      userId,
    });
    return schema.Wallet.parse(newWallets[0]);
  };

  private getWallets = async (where?: SQL): Promise<schema.Wallet[]> => {
    const response = await this.connection.query.walletsTable.findMany({
      where: this.basicWalletFilter(where),
    });
    return response.map(w => schema.Wallet.parse(w));
  };

  getAllWallets = async (userId: string): Promise<schema.Wallet[]> =>
    this.getWallets(eq(walletsTable.userId, userId));

  getWalletById = async (id: string): Promise<schema.Wallet | null> => {
    const wallets = await this.getWallets(eq(walletsTable.id, id));
    if (wallets.length === 0) return null;
    return wallets[0];
  };

  getWalletByName = async (name: string, userId: string): Promise<schema.Wallet | null> => {
    const wallets = await this.getWallets(
      and(eq(walletsTable.name, name), eq(walletsTable.userId, userId))
    );
    if (wallets.length === 0) return null;
    return wallets[0];
  };

  updateWallet = async (id: string, data: schema.UpdateWallet): Promise<schema.Wallet | null> => {
    const updated = await this.connection
      .update(walletsTable)
      .set({ updatedAt: new Date(), ...data })
      .where(this.basicWalletFilter(eq(walletsTable.id, id)))
      .returning();
    if (updated.length === 0) return null;
    return schema.Wallet.parse(updated[0]);
  };

  deleteWallet = async (id: string): Promise<boolean> => {
    const updated = await this.connection
      .update(walletsTable)
      .set({ updatedAt: new Date(), deleted: true })
      .where(this.basicWalletFilter(eq(walletsTable.id, id)))
      .returning();
    return updated.length > 0;
  };
}
