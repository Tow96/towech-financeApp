import { zodResolver } from '@hookform/resolvers/zod';
// Hooks
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAddToast } from '@financeapp/frontend-toasts';
// DTO
import { AddUserDto, AddUserSchema } from './AddUserForm.Dto';
// Infraestructure
import { ApiContext } from '@financeapp/frontend-common';
import { TANSTACK_USERS_KEY } from '../_Common';

export const useAddUserForm = (modalParam: string) => {
  // Form Init ------------------------------------------------------
  const form = useForm<AddUserDto>({ resolver: zodResolver(AddUserSchema) });

  // Modal ----------------------------------------------------------
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const openModal = () => {
    const nuParams = new URLSearchParams(params);
    nuParams.append(modalParam, 'y');
    router.replace(`${path}?${nuParams.toString()}`);
    form.reset();
  };

  // Callback -------------------------------------------------------
  const api = new ApiContext();
  const client = useQueryClient();
  const callback = useMutation({
    mutationKey: [TANSTACK_USERS_KEY, 'addUser'],
    mutationFn: async (data: AddUserDto) => await api.post(`users/register`, '', data),
    onSuccess: () => client.invalidateQueries({ queryKey: [TANSTACK_USERS_KEY] }),
  });

  // Toasts ---------------------------------------------------------
  const addToast = useAddToast();
  useEffect(() => {
    if (callback.status === 'success') addToast({ message: 'User added', type: 'success' });
    if (callback.status === 'error')
      addToast({ message: callback.error?.message || 'Error', type: 'error' });
  }, [addToast, callback.status, callback.error?.message]);

  return {
    fields: {
      name: { register: form.register('name'), error: form.formState.errors.name?.message },
      email: { register: form.register('email'), error: form.formState.errors.email?.message },
      password: {
        register: form.register('password'),
        error: form.formState.errors.password?.message,
      },
    },
    open: openModal,
    status: callback.status,
    submit: form.handleSubmit((data) => callback.mutate(data)),
  };
};
