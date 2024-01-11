/** UserService.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Tanstack Store that handles the user state
 */
// Libraries ---------------------------------------------------------
import { jwtDecode } from 'jwt-decode';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/HttpCommon';
import { keys } from '@/utils/TanstackProvider';

// Types ------------------------------------------------------------
type Login = {
  username: string;
  password: string;
  keepSession: boolean;
};
type TokenResponse = {
  token: string;
};
type User = {
  _id: string;
  accountConfirmed: boolean;
  exp: number;
  iat: number;
  name: string;
  role: 'user' | 'admin';
  token: string;
  username: string; // Email
};

// Http calls -------------------------------------------------------
const postWithCredentials = (url: string, payload?: unknown) =>
  apiClient.post(url, payload, { withCredentials: true }) as Promise<TokenResponse>;
const patch = (url: string, token: string, payload?: unknown) =>
  apiClient.patch(url, payload, { headers: { Authorization: `Bearer ${token}` } });

// Adapter ----------------------------------------------------------
const updateUser = (user: Partial<User>, state: User): User => ({ ...state, ...user });
const processUser = (data: TokenResponse): User => {
  const decoded: Omit<User, 'token'> = jwtDecode(data.token);
  return { ...decoded, token: data.token };
};

// Base Hook --------------------------------------------------------
export const useAuth = () =>
  useQuery({
    queryKey: [keys.USERKEY],
    queryFn: async () => processUser(await postWithCredentials('/authentication/refresh')),
    refetchInterval: s => {
      if (s.state.status === 'error') return 0;
      return ((s.state.data?.exp || 0) - (s.state.data?.iat || 0)) * 1000;
    },
  });

// Secondary hooks --------------------------------------------------
export const useLogin = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [keys.USERKEY, 'login'],
    mutationFn: async (cred: Login) => postWithCredentials('/authentication/login', cred),
    onSuccess: (res: TokenResponse) => client.setQueryData([keys.USERKEY], processUser(res)),
    // onError: () => client.setQueryData([keys.USERKEY], null),
  });
};

export const useLogout = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [keys.USERKEY, 'logout'],
    mutationFn: async () => postWithCredentials('/authentication/logout'),
    onSuccess: () => client.setQueryData([keys.USERKEY], null),
    onError: () => client.setQueryData([keys.USERKEY], null),
  });
};

export const useEditUser = () => {
  const client = useQueryClient();
  const user: User | undefined = client.getQueryData([keys.USERKEY]);
  return useMutation({
    mutationKey: [keys.USERKEY, 'update'],
    mutationFn: async (data: Partial<User>) =>
      patch(`/users/${user?._id}`, user?.token || '', data) as Partial<User>,
    onSuccess: (res: Partial<User>) => client.setQueryData([keys.USERKEY], updateUser(res, user!)),
  });
};
