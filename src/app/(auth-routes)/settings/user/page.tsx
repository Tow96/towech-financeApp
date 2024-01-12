/** settings/user/page.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Page that handles the forms for editing the user settings
 */
'use client';
// Libraries ------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth, useEditUser, useResendMail } from '@/libs/feature-authentication/UserService';
import { useAddToast } from '@/libs/feature-toasts/ToastService';
// Used Components ------------------------------------------------------------
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Spinner } from '@/components/spinner';

// Types ----------------------------------------------------------------------
type UserForm = {
  name: string;
  username: string;
};

// Component ------------------------------------------------------------------
const UserSettingsPage = (): JSX.Element => {
  const { data: user } = useAuth();
  const addToast = useAddToast();

  // User Form ----------------------------------
  const editUser = useEditUser();
  const userForm = useForm<UserForm>({
    defaultValues: { name: user?.name, username: user?.username },
  });
  const isDifferent = () => {
    const nameDifferent = userForm.formState.defaultValues?.name !== userForm.getValues('name');
    const mailDifferent =
      userForm.formState.defaultValues?.username !== userForm.getValues('username');
    return nameDifferent || mailDifferent;
  };
  const onUserFormSubmit: SubmitHandler<UserForm> = data => editUser.mutate(data);
  useEffect(() => {
    if (editUser.status === 'success') addToast({ message: 'User updated', type: 'success' });
    if (editUser.status === 'error')
      addToast({ message: editUser.error?.message || 'Error', type: 'error' });
  }, [addToast, editUser.status, editUser.error?.message]);

  // Verification Mail --------------------------
  const resendMail = useResendMail();

  // Render -------------------------------------
  return (
    <main>
      <section data-testid="user-form">
        <h2>Change User</h2>
        <form onSubmit={userForm.handleSubmit(onUserFormSubmit)}>
          <Input
            label="Name"
            register={userForm.register('name', {
              validate: { isDifferent },
            })}
          />
          <Input
            label="Email"
            register={userForm.register('username', {
              validate: { isDifferent },
            })}
          />
          <Button type="submit" disabled={!userForm.formState.isValid}>
            Save
          </Button>
        </form>
        {editUser.status === 'pending' && <Spinner />}
      </section>
      <section data-testid="mail-status">
        <h2>Email status:</h2>
        <span role="caption">{user?.accountConfirmed ? 'Verified' : 'Unverified'}</span>
        {!user?.accountConfirmed && (
          <Button onClick={() => resendMail.mutate()}>Resend verification email</Button>
        )}
      </section>
      {/* TODO: Delete user button*/}
      <section data-testid="delete-user"></section>
    </main>
  );
};

export default UserSettingsPage;
