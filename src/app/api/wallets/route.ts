/** apu/wallets/route.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Api route for getting and adding wallets
 */
import { isAccountConfirmed, isAuthenticated } from '@/libs/feature-authentication/middleware';
import { WalletModel } from '@/libs/feature-wallets/model';
import { apiHandler } from '@/utils/middlewareHandler';

export const GET = apiHandler(isAuthenticated, async req => {
  const userId = req.headers.get('userId')!;

  const wallets = new WalletModel();
  const response = await wallets.getAll(userId);

  return { body: response, status: 200 };
});

export const POST = apiHandler(isAuthenticated, isAccountConfirmed, async req => {
  const userId = req.headers.get('userId');
  const body = await req.json();

  const wallets = new WalletModel();
  const response = await wallets.create({ ...body, userId });

  return { body: response, status: 201 };
});
