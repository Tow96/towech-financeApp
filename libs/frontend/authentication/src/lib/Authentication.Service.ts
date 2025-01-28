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
  });

// Mutation Hooks ---------------------------------------------------
export const useLogin = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [TanstackKeys.AUTH, 'login'],
    mutationFn: async (cred: LoginDto) =>
      await api.postWithCookie<AuthenticationDto>('/login', cred),
    onSuccess: (res) => client.setQueryData([TanstackKeys.AUTH], res),
  });
};

export const useLogout = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [TanstackKeys.AUTH, 'logout'],
    mutationFn: async () => await api.postWithCookie(`/logout`),
    onSuccess: () => client.setQueryData([TanstackKeys.AUTH], null),
    onError: () => client.setQueryData([TanstackKeys.AUTH], null),
  });
};
