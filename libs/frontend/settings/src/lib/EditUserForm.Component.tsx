'use client';
import { ReactElement, useEffect } from 'react';

// Hooks
import { useAddToast } from '@financeapp/frontend-toasts';
import { EditUserDto, useEditUser, useUser } from './User.Service';
import { SubmitHandler, useForm } from 'react-hook-form';

// Components
import { Button, Input } from '@financeapp/frontend-common';

export const EditUserFormComponent = (): ReactElement => {
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
  const editUser = useEditUser();
  const onUserFormSubmit: SubmitHandler<EditUserDto> = (data) => editUser.mutate(data);
  useEffect(() => {
    if (editUser.status === 'success') addToast({ message: 'User updated', type: 'success' });
    if (editUser.status === 'error')
      addToast({ message: editUser.error?.message || 'Error', type: 'error' });
  }, [addToast, editUser.status, editUser.error?.message]);

  // Render ---------------------------------------------------------
  return (
    <section>
      <h2 className="text-2xl">Change User</h2>
      <form onSubmit={userForm.handleSubmit(onUserFormSubmit)}>
        <div className="justify-around gap-2 md:flex">
          <Input
            label="Name"
            disabled={editUser.isPending}
            register={userForm.register('name', { validate: { isFormDifferent } })}
          />
          <Input
            label="Email"
            disabled={editUser.isPending}
            register={userForm.register('email', { validate: { isFormDifferent } })}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={editUser.isPending}
            disabled={!userForm.formState.isValid || editUser.isPending}
          >
            Save
          </Button>
        </div>
      </form>
    </section>
  );
};
