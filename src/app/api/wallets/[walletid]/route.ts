/** api/wallets/[walletid]/route.ts
 * Copyright (c) 2024, Towechlabs
 *
 *  Routes for managing wallets
 */
import { isAccountConfirmed } from '@/libs/feature-authentication';
import { canManageWallet } from '@/libs/feature-transactions/Middleware';
import { TransactionsModel } from '@/libs/feature-transactions';
import { UpdateWallet, Wallet } from '@/libs/feature-transactions/Schema';
import { ErrorResponse, apiHandler } from '@/utils/MiddlewareHandler';

export const GET = apiHandler(isAccountConfirmed, canManageWallet, async req => {
  const wallet: Wallet = JSON.parse(req.headers.get('wallet') || '{}');
  return { body: wallet, status: 200 };
});

export const PUT = apiHandler(isAccountConfirmed, canManageWallet, async req => {
  const validatedData = UpdateWallet.parse(await req.json());
  if (Object.keys(validatedData).length === 0) throw new ErrorResponse('No data', null, 422); // Move this to the parse

  const wallet: Wallet = JSON.parse(req.headers.get('wallet') || '{}');
  const transactions = new TransactionsModel();

  const updatedWallet = await transactions.updateWallet(wallet.id, validatedData);
  return { body: updatedWallet, status: 201 };
});

export const DELETE = apiHandler(isAccountConfirmed, canManageWallet, async req => {
  const wallet: Wallet = JSON.parse(req.headers.get('wallet') || '{}');
  const transactions = new TransactionsModel();
  transactions.deleteWallet(wallet.id);
});
