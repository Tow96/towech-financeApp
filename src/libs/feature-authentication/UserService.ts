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
export type Login = {
  username: string;
  password: string;
  keepSession: boolean;
};
export type ChangePassword = {
  confirmPassword: string;
  newPassword: string;
  oldPassword: string;
};
type TokenResponse = {
  token: string;
};
export type User = {
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
const patch = (url: string, token?: string, payload?: unknown) =>
  apiClient.patch(url, payload, { headers: { Authorization: `Bearer ${token}` } });
const put = (url: string, token?: string, payload?: unknown) =>
  apiClient.put(url, payload, { headers: { Authorization: `Bearer ${token}` } });
const get = (url: string, token?: string) =>
  apiClient.get(url, { headers: { Authorization: `Bearer ${token}` } });

// Adapter ----------------------------------------------------------
const updateUser = (user: Partial<User>, state: User): User => ({ ...state, ...user });
const processToken = (token: TokenResponse): User => {
  const decoded: Omit<User, 'token'> = jwtDecode(token.token);
  return { ...decoded, token: token.token };
};

// Query Hook -------------------------------------------------------
export const useAuth = () =>
  useQuery({
    queryKey: [keys.USERKEY],
    queryFn: async () => processToken(await postWithCredentials('/authentication/refresh')),
    refetchInterval: s => {
      if (s.state.status === 'error') return 0;
      return ((s.state.data?.exp || 0) - (s.state.data?.iat || 0)) * 1000;
    },
  });

// Mutation hooks ---------------------------------------------------
export const useLogin = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [keys.USERKEY, 'login'],
    mutationFn: async (cred: Login) => postWithCredentials('/authentication/login', cred),
    onSuccess: (res: TokenResponse) => client.setQueryData([keys.USERKEY], processToken(res)),
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
      patch(`/users/${user?._id}`, user?.token, data) as Partial<User>,
    onSuccess: (res: Partial<User>) => client.setQueryData([keys.USERKEY], updateUser(res, user!)),
  });
};

export const useResendMail = () => {
  const client = useQueryClient();
  const user: User | undefined = client.getQueryData([keys.USERKEY]);
  return useMutation({
    mutationKey: [keys.USERKEY, 'resend mail'],
    mutationFn: async () => get(`/users/email`, user?.token),
  });
};

export const usePasswordChange = () => {
  const client = useQueryClient();
  const user: User | undefined = client.getQueryData([keys.USERKEY]);
  return useMutation({
    mutationKey: [keys.USERKEY, 'change password'],
    mutationFn: async (data: ChangePassword) => put('/users/password', user?.token, data),
  });
};
