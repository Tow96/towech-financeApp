import { ApiContext } from '@financeapp/frontend-common';
import { useMutation } from '@tanstack/react-query';
import { TANSTACK_USER_KEY } from '../_Common/User.Hook';
import { useAddToast } from '@financeapp/frontend-toasts';
import { useEffect } from 'react';

const usePasswordResetCallback = () => {
  const api = new ApiContext();
  return useMutation({
    mutationKey: [TANSTACK_USER_KEY, 'reset password'],
    mutationFn: async (email: string) => api.post(`users/password/send-reset`, '', { email }),
  });
};

export const usePasswordReset = () => {
  const addToast = useAddToast();
  const resetPass = usePasswordResetCallback();
  useEffect(() => {
    if (resetPass.status === 'success') addToast({ message: 'Email sent', type: 'success' });
    if (resetPass.status === 'error')
      addToast({ message: resetPass.error?.message || 'Error', type: 'error' });
  }, [addToast, resetPass.status, resetPass.error?.message]);

  return {
    isPending: resetPass.isPending,
    send: resetPass.mutate,
  };
};
