/** UserService.ts
 * Copyright (c) 2023, TowechLabs
 *
 * Tanstack Store that handles the user state
 */
// Libraries ---------------------------------------------------------
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HttpContext, TanstackKeys } from '@financeapp/frontend-common';

// Model ------------------------------------------------------------
type AuthenticationDto = {
  accountVerified: string;
  role: string;
  userId: string;
  legacyId: string;
  token: string;
};

export type LoginDto = { email: string; password: string; keepSession: boolean };

// Adapter ----------------------------------------------------------
const api = new HttpContext();
// const updateUser = (user: Partial<User>, state: User): User => ({ ...state, ...user });

export const useAuthentication = () =>
  useQuery({
    queryKey: [TanstackKeys.AUTH],
    queryFn: async () => await api.post<AuthenticationDto>('/refresh'),
  });

// Mutation Hooks ---------------------------------------------------
export const useLogin = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [TanstackKeys.AUTH, 'login'],
    mutationFn: async (cred: LoginDto) => await api.post<AuthenticationDto>('/login', cred),
    onSuccess: (res) => client.setQueryData([TanstackKeys.AUTH], res),
  });
};

export const useLogout = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [TanstackKeys.AUTH, 'logout'],
    mutationFn: async () => await api.delete(`/logout`),
    onSuccess: () => client.setQueryData([TanstackKeys.AUTH], null),
    onError: () => client.setQueryData([TanstackKeys.AUTH], null),
  });
};
