/** TransactionService.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Tanstack Store that handles the transactions and wallets
 */
// Libraries -------------------------------------------------------
import {
  UseQueryResult,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '@/utils/HttpCommon';
import { keys } from '@/utils/TanstackProvider';
import { Wallet, InsertWallet, UpdateWallet } from './Schema';

// Adapter --------------------------------------------------------------------
const api = new apiClient();

// Query Hook -----------------------------------------------------------------
export const useWalletIds = (): UseQueryResult<string[] | Error> =>
  useQuery({
    queryKey: [keys.WALLETKEY],
    queryFn: async () => (await api.get<Wallet[]>('/wallets')).map(w => w.id),
  });
export const useWallet = (id: string): UseQueryResult<Wallet | Error> =>
  useQuery({
    queryKey: [keys.WALLETKEY, id],
    queryFn: async () => await api.get<Wallet>(`/wallets/${id}`),
  });
export const useWallets = (ids: string[] | undefined): UseQueryResult<Wallet | Error>[] =>
  useQueries({
    queries: (ids ?? []).map(id => ({
      queryKey: [keys.WALLETKEY, id],
      queryFn: async () => await api.get<Wallet>(`/wallets/${id}`),
    })),
  });

// Mutation hooks -------------------------------------------------------------
export const useAddWallet = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [keys.WALLETKEY, 'add'],
    mutationFn: async (newWallet: InsertWallet) => await api.post<Wallet>('/wallets', newWallet),
    onSuccess: res => client.setQueryData([keys.WALLETKEY, res.id], res),
  });
};
export const useEditWallet = (id: string) => {
  const client = useQueryClient();
  const state: Wallet | undefined = client.getQueryData([keys.WALLETKEY, id]);
  return useMutation({
    mutationKey: [keys.WALLETKEY, id, 'edit'],
    mutationFn: async (data: { id: string; wallet: UpdateWallet }) =>
      await api.put<Wallet>(`/wallets/${data.id}`, data.wallet),
    onSuccess: res => client.setQueryData([keys.WALLETKEY, id], { ...state, ...res }),
  });
};
export const useDeleteWallet = (id: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [keys.WALLETKEY, id, 'delete'],
    mutationFn: async () => await api.delete(`/wallets/${id}`),
    onSuccess: () => client.setQueryData([keys.WALLETKEY, id], null),
  });
};
