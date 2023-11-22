/** UserService.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Tanstack Store that handles the user state
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/utils/HttpCommon';

// Constants --------------------------------------------------------
const tokenkey = 'token';

// Types ------------------------------------------------------------
type Login = {
  username: string;
  password: string;
  keepSession: boolean;
};

// Base Hook --------------------------------------------------------
export const useAuth = () =>
  useQuery({
    queryKey: [tokenkey],
    queryFn: async () =>
      await apiClient.post('/authentication/refresh', {}, { withCredentials: true }),
    retry: 0,
  });

// Secondary hooks --------------------------------------------------
export const useLogin = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: Login) =>
      await apiClient.post('/authentication/login', credentials, { withCredentials: true }),
    onSuccess: res => {
      client.setQueryData([tokenkey], res.data);
    },
    onError: () => console.error('FAIL'),
  });
};

export const useLogout = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await apiClient.post('/authentication/logout', {}, { withCredentials: true }),
    onSuccess: () => client.setQueryData([tokenkey], null),
  });
};
