/** model.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Class that handles the proper connection to the database
 */
// Libraries ------------------------------------------------------------------
import { ObjectId } from 'bson';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/libs/data-access/connection';
// Schemas --------------------------------------------------------------------
import { InsertWallet, insertWalletSchema, wallets, Wallet } from '@/libs/data-access/schema';
import { ErrorResponse } from '@/utils/middlewareHandler';

export class WalletModel {
  create = async (wallet: InsertWallet): Promise<Wallet> => {
    const validatedWallet = insertWalletSchema.parse(wallet);
    const id = new ObjectId().toString();

    // TODO: optimize this calls to reduce trips
    const walletExists = await db
      .select({ value: sql<number>`count(*)::int` })
      .from(wallets)
      .where(
        sql`${wallets.userId} = ${validatedWallet.userId} AND ${wallets.name} = ${validatedWallet.name}`
      );
    if (walletExists[0].value !== 0)
      throw new ErrorResponse(`${validatedWallet.name} already exists`, {}, 422);
    if (validatedWallet.parentId) {
      const parentWallet = await db.query.wallets.findFirst({
        where: eq(wallets.id, validatedWallet.parentId),
      });
      if (parentWallet?.parentId !== null)
        throw new ErrorResponse('Only topmost wallest can have subwallets', null, 422);
    }

    const dbResponse = (
      await db
        .insert(wallets)
        .values({ ...validatedWallet, id })
        .returning()
    )[0];
    // TODO:Add initial transaction

    return dbResponse;
  };

  getAll = async (userId: string): Promise<Wallet[]> => {
    const result = await db
      .select()
      .from(wallets)
      .where(sql`${wallets.userId} = ${userId}`);
    return result as Wallet[];
  };
}
