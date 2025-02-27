// Hooks
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAddToast } from '@financeapp/frontend-toasts';
import { useAuthentication } from '@financeapp/frontend-authentication';
import { TANSTACK_USER_KEY, useUser } from '../_Common/User.Hook';
// Infrastructure
import { ApiContext } from '@financeapp/frontend-common';

export type EditUserDto = {
  name: string;
  email: string;
};

// Tanstack call
export const useEditUserCallback = () => {
  const api = new ApiContext();
  const client = useQueryClient();

  const { data: auth } = useAuthentication();
  const { data: user } = useUser();

  return useMutation({
    mutationKey: [TANSTACK_USER_KEY, 'update'],
    mutationFn: async (data: EditUserDto) => {
      if (auth) await api.patch(`users/${auth.userId}`, auth.token, data);
      else throw Error('Not authorized');
      return data;
    },
    onSuccess: (res) => client.setQueryData([TANSTACK_USER_KEY], { ...user, ...res }),
  });
};

// Complete form hook
export const useEditUserForm = () => {
  // Form Init ------------------------------------------------------
  const { data: user } = useUser();
  const userForm = useForm<EditUserDto>({
    defaultValues: { name: user?.name, email: user?.email },
  });
  const isFormDifferent = () => {
    const nameDifferent = userForm.formState.defaultValues?.name !== userForm.getValues('name');
    const mailDifferent = userForm.formState.defaultValues?.email !== userForm.getValues('email');
    return nameDifferent || mailDifferent;
  };
  useEffect(() => {
    userForm.setValue('name', user?.name || '');
    userForm.setValue('email', user?.email || '');
  }, [user?.name, user?.email, userForm]);

  // Update user and toasts -----------------------------------------
  const addToast = useAddToast();
  const editUser = useEditUserCallback();
  const onUserFormSubmit: SubmitHandler<EditUserDto> = (data) => editUser.mutate(data);
  useEffect(() => {
    if (editUser.status === 'success') addToast({ message: 'User updated', type: 'success' });
    if (editUser.status === 'error')
      addToast({ message: editUser.error?.message || 'Error', type: 'error' });
  }, [addToast, editUser.status, editUser.error?.message]);

  return {
    isPending: editUser.isPending,
    isValid: userForm.formState.isValid,
    registerEmail: userForm.register('email', { validate: { isFormDifferent } }),
    registerName: userForm.register('name', { validate: { isFormDifferent } }),
    onSubmit: userForm.handleSubmit(onUserFormSubmit),
  };
};
