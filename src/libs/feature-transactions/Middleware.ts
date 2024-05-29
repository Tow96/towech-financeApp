/** Middleware.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Middleware for the transaction related routes
 */
import { ErrorResponse, Middleware } from '@/utils';
import { User } from '@/libs/feature-authentication';
import { TransactionsModel } from './Model';

export const canManageWallet: Middleware = async (req, { params }) => {
  const walletId = params?.walletid;
  const user: User = JSON.parse(req.headers.get('user') || '{}');
  if (!user.id || !walletId) throw new ErrorResponse('Unauthorized', {}, 401);

  const transactions = new TransactionsModel();
  const wallet = await transactions.getWallet(walletId);
  if (wallet === null) throw new ErrorResponse('Not found', {}, 404);

  if (wallet.userId !== user.id) throw new ErrorResponse('Forbidden', {}, 403);
  req.headers.set('wallet', JSON.stringify(wallet));
};
