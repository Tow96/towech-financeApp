import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiContext, TanstackKeys } from '@financeapp/frontend-common';
import { useAuthentication } from '@financeapp/frontend-authentication';
import { z } from 'zod';

// Models -----------------------------------------------------------
type UserDto = {
  id: string;
  name: string;
  email: string;
  role: string;
  accountVerified: boolean;
};

export type EditUserDto = {
  name: string;
  email: string;
};

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty('Password is required'),
    newPassword: z.string().nonempty('New password is required'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'Passwords must not be the same',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Confirm Password must match new password',
    path: ['confirmPassword'],
  });
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;

// Adapter ----------------------------------------------------------
const api = new ApiContext();

export const useUser = () => {
  const auth = useAuthentication();
  return useQuery({
    queryKey: [TanstackKeys.USER],
    queryFn: async () =>
      await api.get<UserDto>(`users/${auth.data?.userId}`, auth.data?.token || ''),
    enabled: auth.isSuccess,
  });
};

export const useEditUser = () => {
  const client = useQueryClient();

  const { data: auth } = useAuthentication();
  const { data: user } = useUser();

  return useMutation({
    mutationKey: [TanstackKeys.USER, 'update'],
    mutationFn: async (data: EditUserDto) => {
      if (auth) await api.patch(`users/${auth.userId}`, auth.token, data);
      else throw Error('Not authorized');
      return data;
    },
    onSuccess: (res) => client.setQueryData([TanstackKeys.USER], { ...user, ...res }),
  });
};

export const useSendVerification = () => {
  const { data: auth } = useAuthentication();
  return useMutation({
    mutationKey: [TanstackKeys.USER, 'resend mail'],
    mutationFn: async () => {
      if (auth) await api.post(`users/${auth.userId}/email/send-verification`, auth.token);
    },
  });
};

export const useChangePassword = () => {
  const { data: auth } = useAuthentication();
  return useMutation({
    mutationKey: [TanstackKeys.USER, 'change password'],
    mutationFn: async (data: ChangePasswordDto) => {
      if (auth) await api.patch(`users/${auth.userId}/password`, auth.token, data);
    },
  });
};
