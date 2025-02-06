import { useAuthentication } from '@financeapp/frontend-authentication';
import { ApiContext } from '@financeapp/frontend-common';
import { TANSTACK_USER_KEY } from '../_Common/User.Hook';
import { useMutation } from '@tanstack/react-query';
import { ChangePasswordDto, ChangePasswordSchema } from './ChangePassword.Dto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddToast } from '@financeapp/frontend-toasts';
import { useEffect } from 'react';

const useChangePasswordCallback = () => {
  const api = new ApiContext();
  const { data: auth } = useAuthentication();

  return useMutation({
    mutationKey: [TANSTACK_USER_KEY, 'change password'],
    mutationFn: async (data: ChangePasswordDto) => {
      if (auth) await api.patch(`users/${auth.userId}/password`, auth.token, data);
    },
  });
};

export const useChangePasswordForm = () => {
  // Form Init ------------------------------------------------------
  const changePasswordForm = useForm<ChangePasswordDto>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  // Change password and toasts -------------------------------------
  const addToast = useAddToast();
  const changePassword = useChangePasswordCallback();
  const onPasswordChangeSubmit: SubmitHandler<ChangePasswordDto> = (data) =>
    changePassword.mutate(data);
  useEffect(() => {
    if (changePassword.status === 'success') {
      addToast({ message: 'Password changed', type: 'success' });
      changePasswordForm.reset();
    }
    if (changePassword.status === 'error')
      addToast({ message: changePassword.error?.message || 'Error', type: 'error' });
  }, [addToast, changePassword.status, changePassword.error?.message]);

  return {
    isPending: changePassword.isPending,
    oldPassword: {
      register: changePasswordForm.register('oldPassword'),
      error: changePasswordForm.formState.errors.oldPassword?.message,
    },
    newPassword: {
      register: changePasswordForm.register('newPassword'),
      error: changePasswordForm.formState.errors.newPassword?.message,
    },
    confirmPassword: {
      register: changePasswordForm.register('confirmPassword'),
      error: changePasswordForm.formState.errors.confirmPassword?.message,
    },
    onSubmit: changePasswordForm.handleSubmit(onPasswordChangeSubmit),
  };
};
