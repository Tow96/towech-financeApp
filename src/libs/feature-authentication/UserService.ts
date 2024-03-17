/** UserService.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Tanstack Store that handles the user state
 */
// Libraries ---------------------------------------------------------
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/HttpCommon';
import { keys } from '@/utils/TanstackProvider';
import { Login, User } from './Schema';

// Adapter ----------------------------------------------------------
const api = new apiClient();
const updateUser = (user: Partial<User>, state: User): User => ({ ...state, ...user });

// Query Hook -------------------------------------------------------
export const useAuth = () =>
  useQuery({
    queryKey: [keys.USERKEY],
    queryFn: async () => await api.get<User>('/session'),
  });

// Mutation hooks ---------------------------------------------------
export const useLogin = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [keys.USERKEY, 'login'],
    mutationFn: async (cred: Login) => await api.post<User>('/session', cred),
    onSuccess: res => client.setQueryData([keys.USERKEY], res),
  });
};

export const useLogout = () => {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [keys.USERKEY, 'logout'],
    mutationFn: async (all?: boolean) => await api.delete(`/session${all ? '?all' : ''}`),
    onSuccess: () => client.setQueryData([keys.USERKEY], null),
    onError: () => client.setQueryData([keys.USERKEY], null),
  });
};

export const useEditUser = () => {
  const client = useQueryClient();
  const user: User | undefined = client.getQueryData([keys.USERKEY]);
  return useMutation({
    mutationKey: [keys.USERKEY, 'update'],
    mutationFn: (data: Partial<User>): Promise<User> => api.patch(`/users/${user?.id}`, data),
    onSuccess: res => client.setQueryData([keys.USERKEY], updateUser(res, user!)),
  });
};

// export const useResendMail = () => {
//   const client = useQueryClient();
//   const user: User | undefined = client.getQueryData([keys.USERKEY]);
//   // return useMutation({
//   //   mutationKey: [keys.USERKEY, 'resend mail'],
//   //   mutationFn: async () => api.get(`/users/email`, user?.token),
//   // });
// };

// export const usePasswordChange = () => {
//   const client = useQueryClient();
//   const user: User | undefined = client.getQueryData([keys.USERKEY]);
//   // return useMutation({
//   //   mutationKey: [keys.USERKEY, 'change password'],
//   //   mutationFn: async (data: ChangePassword) => api.put('/users/password', user?.token, data),
//   // });
// };

// export const usePasswordReset = () => {
//   const client = useQueryClient();
//   const user: User | undefined = client.getQueryData([keys.USERKEY]);
//   // return useMutation({
//   //   mutationKey: [keys.USERKEY, 'reset password'],
//   //   mutationFn: async () => api.postWithCredentials('/users/reset', { username: user?.username }),
//   // });
// };
