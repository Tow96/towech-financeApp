// Hooks
import { useAddToast } from '@financeapp/frontend-toasts';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ApiContext } from '@financeapp/frontend-common';
import { useEffect } from 'react';

export type VerifyUserFormDto = {
  email: string;
  code: string;
};

export const useVerifyUserForm = () => {
  // Form Init ------------------------------------------------------
  const form = useForm<VerifyUserFormDto>();

  // Verification sending -------------------------------------------
  const api = new ApiContext();
  const callback = useMutation({
    mutationKey: ['verify-email'],
    mutationFn: async (data: VerifyUserFormDto) => await api.post(`users/email/verify`, '', data),
  });

  // Toasts and notifications ---------------------------------------
  const addToast = useAddToast();
  useEffect(() => {
    if (callback.status === 'error')
      addToast({ message: callback.error?.message || 'Error', type: 'error' });
  }, [addToast, callback.status, callback.error?.message]);

  return {
    status: callback.status,
    email: {
      register: form.register('email'),
      error: form.formState.errors.email?.message,
    },
    code: {
      register: form.register('code'),
      error: form.formState.errors.code?.message,
    },
    onSubmit: form.handleSubmit((data) => callback.mutate(data)),
  };
};
