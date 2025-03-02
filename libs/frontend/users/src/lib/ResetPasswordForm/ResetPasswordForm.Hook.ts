import { useForm } from 'react-hook-form';
import { ApiContext } from '@financeapp/frontend-common';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAddToast } from '@financeapp/frontend-toasts';

type ResetPasswordFormDto = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export const useResetPasswordForm = () => {
  // Form Init ------------------------------------------------------
  const form = useForm<ResetPasswordFormDto>();

  // Callbacks ------------------------------------------------------
  const api = new ApiContext();
  const sendCallback = useMutation({
    mutationKey: ['reset-password-send'],
    mutationFn: async (email: string) => await api.post(`users/password/send-reset`, '', { email }),
  });
  const resetCallback = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async (data: ResetPasswordFormDto) =>
      await api.post(`users/password/reset`, '', data),
  });

  // Mode switcher --------------------------------------------------
  const [mode, setMode] = useState<'send' | 'reset'>('send');
  useEffect(() => {
    if (sendCallback.status === 'success') setMode('reset');
  }, [sendCallback.status]);

  // Toasts and notifications ---------------------------------------
  const addToast = useAddToast();
  useEffect(() => {
    if (sendCallback.status === 'error')
      addToast({ message: sendCallback.error?.message || 'Error', type: 'error' });
    if (resetCallback.status === 'error')
      addToast({ message: resetCallback.error?.message || 'Error', type: 'error' });
  }, [
    addToast,
    sendCallback.status,
    resetCallback.status,
    sendCallback.error?.message,
    resetCallback.error?.message,
  ]);

  return {
    sendStatus: sendCallback.status,
    resetStatus: resetCallback.status,
    email: {
      register: form.register('email'),
      error: form.formState.errors.email?.message,
    },
    code: {
      register: form.register('code'),
      error: form.formState.errors.code?.message,
    },
    newPassword: {
      register: form.register('newPassword'),
      error: form.formState.errors.newPassword?.message,
    },
    confirmPassword: {
      register: form.register('confirmPassword'),
      error: form.formState.errors.confirmPassword?.message,
    },
    mode,
    setMode,
    onSubmit: form.handleSubmit((data) =>
      mode === 'send' ? sendCallback.mutate(data.email) : resetCallback.mutate(data)
    ),
  };
};
