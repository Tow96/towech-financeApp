/** UserService.ts
 * Copyright (c) 2023, TowechLabs
 *
 * Tanstack Store that handles the user state
 */
// Libraries ---------------------------------------------------------
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiContext, TanstackKeys } from '@financeapp/frontend-common';

// Model ------------------------------------------------------------
export type AuthenticationDto = {
  accountVerified: string;
  role: string;
  userId: string;
  legacyId: string;
  token: string;
};

export type LoginDto = { email: string; password: string; keepSession: boolean };

// Adapter ----------------------------------------------------------
const api = new ApiContext();

export const useAuthentication = () =>
  useQuery({
    queryKey: [TanstackKeys.AUTH],
    queryFn: async () => await api.postWithCookie<AuthenticationDto>('/refresh'),
    staleTime: 1000 * 60 * 4, // 4 min
    retry: 0,
  });

// Mutation Hooks ---------------------------------------------------
export const useLogin = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [TanstackKeys.AUTH, 'login'],
    retry: 0,
    mutationFn: async (cred: LoginDto) =>
      await api.postWithCookie<AuthenticationDto>('/login', cred),
    onSuccess: (res) => client.setQueryData([TanstackKeys.AUTH], res),
  });
};

export const useLogout = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [TanstackKeys.AUTH, 'logout'],
    retry: 0,
    mutationFn: async () => await api.postWithCookie(`/logout`),
    onSuccess: () => client.removeQueries({ queryKey: [TanstackKeys.AUTH] }),
    onError: () => client.removeQueries({ queryKey: [TanstackKeys.AUTH] }),
  });
};
