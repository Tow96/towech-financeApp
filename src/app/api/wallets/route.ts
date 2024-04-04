/** apu/wallets/route.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Api route for getting and adding wallets
 */
import { isAccountConfirmed } from '@/libs/feature-authentication';
import { TransactionsModel } from '@/libs/feature-transactions';
import { InsertWallet } from '@/libs/feature-transactions/Schema';
import { apiHandler } from '@/utils/MiddlewareHandler';

export const GET = apiHandler(isAccountConfirmed, async req => {
  const userId: string = JSON.parse(req.headers.get('user') || '{}').id;
  const transactions = new TransactionsModel();

  return { body: await transactions.getAllWallets(userId), status: 200 };
});

export const POST = apiHandler(isAccountConfirmed, async req => {
  const validatedData = InsertWallet.parse(await req.json());
  const userId: string = JSON.parse(req.headers.get('user') || '{}').id;
  const transactions = new TransactionsModel();

  const newWallet = await transactions.createWallet(userId, validatedData);

  return { body: newWallet, status: 201 };
});
