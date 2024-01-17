/** ChangePasswordForm.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Form that handles the changing of passwords
 */
'use client';
// Libraries ------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { usePasswordChange, ChangePassword } from '@/libs/feature-authentication/UserService';
import { useAddToast } from '@/libs/feature-toasts/ToastService';
// Used Components ------------------------------------------------------------
import { Button } from '@/components/button';
import { Input } from '@/components/input';

// Component ------------------------------------------------------------------
export const ChangePasswordForm = (): JSX.Element => {
  const addToast = useAddToast();

  const changePass = usePasswordChange();

  const changePassForm = useForm<ChangePassword>();
  const onChangePassSubmit: SubmitHandler<ChangePassword> = data => changePass.mutate(data);
  useEffect(() => {
    if (changePass.status === 'success') {
      addToast({ message: 'Password updated', type: 'success' });
      changePassForm.reset();
    }
    if (changePass.status === 'error')
      addToast({ message: changePass.error?.message || 'Error', type: 'error' });
  }, [addToast, changePassForm, changePass.status, changePass.error?.message]);

  // Render -------------------------------------
  return (
    <section>
      <h2 className="text-2xl">Change Password</h2>
      <form onSubmit={changePassForm.handleSubmit(onChangePassSubmit)}>
        <Input
          label="Old password"
          type="password"
          disabled={changePass.isPending}
          register={changePassForm.register('oldPassword', { required: true })}
        />
        <div className="w-full gap-2 md:flex">
          <Input
            label="New password"
            type="password"
            disabled={changePass.isPending}
            register={changePassForm.register('newPassword', { required: true })}
          />
          <Input
            label="Confirm new password"
            type="password"
            disabled={changePass.isPending}
            register={changePassForm.register('confirmPassword', { required: true })}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={changePass.isPending}
            disabled={!changePassForm.formState.isValid || changePass.isPending}>
            Save
          </Button>
        </div>
      </form>
    </section>
  );
};
