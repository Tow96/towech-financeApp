import { useAuthentication } from '@financeapp/frontend-authentication';
import { ApiContext } from '@financeapp/frontend-common';
import { useMutation } from '@tanstack/react-query';
import { TANSTACK_USER_KEY, useUser } from '../_Common/User.Hook';
import { useAddToast } from '@financeapp/frontend-toasts';
import { useEffect } from 'react';

const useSendVerificationCallback = () => {
  const api = new ApiContext();
  const { data: auth } = useAuthentication();
  return useMutation({
    mutationKey: [TANSTACK_USER_KEY, 'resend mail'],
    mutationFn: async () => {
      if (auth) await api.post(`users/${auth.userId}/email/send-verification`, auth.token);
    },
  });
};

export const useVerifyUserButton = () => {
  const { data: user } = useUser();

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
    isVerified: user?.accountVerified,
    send: sendVerificationEmail.mutate,
  };
};
