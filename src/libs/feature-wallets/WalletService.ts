/** WalletService.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Tanstack Stores that handle the wallets state
 */
// Libraries ------------------------------------------------------------------
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/HttpCommon';
import { keys } from '@/utils/TanstackProvider';
import { User } from '../feature-authentication/UserService';

// Types ----------------------------------------------------------------------
export type Wallet = {
  _id: string;
  user_id: string;
  icon_id: number;
  parent_id: string | null;
  name: string;
  currency: string;
  money: number;
  createdAt: Date;
};

// Adapter --------------------------------------------------------------------
const api = new apiClient();
const pluralKey = `${keys.WALLETKEY}s`; // Will lead to grammar errors, but is an internal name, so it doesn't matter
const processWallets = (wallets: Wallet[]): Wallet[] => wallets.filter(w => w.parent_id === null);

// List query Hook ------------------------------------------------------------
export const useWallets = () => {
  const client = useQueryClient();
  const { token } = (client.getQueryData([keys.USERKEY]) as User) || { token: 'token' };
  return useQuery({
    queryKey: [pluralKey],
    queryFn: async () => processWallets((await api.get('/wallets', token)) as any), // TODO: Remove any
  });
};
export const useWallet = (id: string) => {
  const client = useQueryClient();
  const { token } = (client.getQueryData([keys.USERKEY]) as User) || { token: 'token' };
  return useQuery({
    queryKey: [keys.WALLETKEY, id],
    queryFn: () => api.get<Wallet>(`/wallets/${id}`, token),
  });
};
