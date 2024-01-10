/** UserService.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Tanstack Store that handles the user state
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/HttpCommon';
import { keys } from '@/utils/TanstackProvider';

// Constants --------------------------------------------------------
const TOKENDURATIONMS = 5 * 1000;

// Types ------------------------------------------------------------
type Login = {
  username: string;
  password: string;
  keepSession: boolean;
};
type TokenResponse = {
  token: string;
};

// Http calls -------------------------------------------------------
const postWithCredentials = (url: string, payload?: unknown) =>
  apiClient.post(url, payload, { withCredentials: true }) as Promise<TokenResponse>;
const processUser = (data: TokenResponse) => data.token;

// Base Hook --------------------------------------------------------
export const useAuth = () =>
  useQuery({
    queryKey: [keys.USERKEY],
    queryFn: async () => processUser(await postWithCredentials('/authentication/refresh')),
    refetchInterval: s => {
      if (s.state.status === 'error') return 0;
      return TOKENDURATIONMS;
    },
  });

// Secondary hooks --------------------------------------------------
export const useLogin = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (cred: Login) => postWithCredentials('/authentication/login', cred),
    onSuccess: (res: TokenResponse) => client.setQueryData([keys.USERKEY], processUser(res)),
    // onError: () => client.setQueryData([keys.USERKEY], null),
  });
};

export const useLogout = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async () => postWithCredentials('/authentication/logout'),
    onSuccess: () => client.setQueryData([keys.USERKEY], null),
    onError: () => client.setQueryData([keys.USERKEY], null),
  });
};
