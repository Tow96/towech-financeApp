/** editUserForm.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Form that is used to edit the user data
 */
'use client';
// Libraries ------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth, useEditUser } from '@/libs/feature-authentication/UserService';
import { useAddToast } from '@/libs/feature-toasts/ToastService';
// Used Components ------------------------------------------------------------
import { Button } from '@/components/button';
import { Input } from '@/components/input';

// Types ----------------------------------------------------------------------
type EditUserForm = {
  name: string;
  username: string;
};

// Component ------------------------------------------------------------------
export const EditUserForm = (): JSX.Element => {
  const addToast = useAddToast();

  const { data: user } = useAuth();
  const editUser = useEditUser();

  const userForm = useForm<EditUserForm>({
    defaultValues: { name: user?.name, username: user?.username },
  });
  const isDifferent = () => {
    const nameDifferent = userForm.formState.defaultValues?.name !== userForm.getValues('name');
    const mailDifferent =
      userForm.formState.defaultValues?.username !== userForm.getValues('username');
    return nameDifferent || mailDifferent;
  };

  const onUserFormSubmit: SubmitHandler<EditUserForm> = data => editUser.mutate(data);
  useEffect(() => {
    if (editUser.status === 'success') addToast({ message: 'User updated', type: 'success' });
    if (editUser.status === 'error')
      addToast({ message: editUser.error?.message || 'Error', type: 'error' });
  }, [addToast, editUser.status, editUser.error?.message]);

  // Render -------------------------------------
  return (
    <section>
      <h2 className="text-2xl">Change User</h2>
      <form onSubmit={userForm.handleSubmit(onUserFormSubmit)}>
        <div className="justify-around md:flex">
          <Input
            label="Name"
            disabled={editUser.isPending}
            register={userForm.register('name', {
              validate: { isDifferent },
            })}
          />
          <Input
            label="Email"
            disabled={editUser.isPending}
            register={userForm.register('username', {
              validate: { isDifferent },
            })}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={editUser.isPending}
            disabled={!userForm.formState.isValid || editUser.isPending}>
            Save
          </Button>
        </div>
      </form>
    </section>
  );
};
