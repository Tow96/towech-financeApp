import { useAuthentication } from '@financeapp/frontend-authentication';
import { ApiContext } from '@financeapp/frontend-common';
import { useMutation } from '@tanstack/react-query';
import { TANSTACK_USER_KEY } from './User.Hook';
import { useAddToast } from '@financeapp/frontend-toasts';
import { useEffect } from 'react';

const useSendVerificationCallback = () => {
  const api = new ApiContext();
  const { data: auth } = useAuthentication();
  return useMutation({
    mutationKey: [TANSTACK_USER_KEY, 'resend mail'],
    mutationFn: async (id: string) => {
      if (auth) await api.post(`users/email/send-verification/${id}`, auth.token);
    },
  });
};

export const useVerifyUser = () => {
  // Verification email sending -------------------------------------
  const sendVerificationEmail = useSendVerificationCallback();
  const addToast = useAddToast();
  useEffect(() => {
    if (sendVerificationEmail.status === 'success')
      addToast({ message: 'Email sent', type: 'success' });
    if (sendVerificationEmail.status === 'error')
      addToast({ message: sendVerificationEmail.error?.message || 'Error', type: 'error' });
  }, [addToast, sendVerificationEmail.status, sendVerificationEmail.error?.message]);

  return {
    isPending: sendVerificationEmail.isPending,
    send: sendVerificationEmail.mutate,
  };
};
