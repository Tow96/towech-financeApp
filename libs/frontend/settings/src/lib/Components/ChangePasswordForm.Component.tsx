'use client';
import { ReactElement, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
// Hooks
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAddToast } from '@financeapp/frontend-toasts';
import { ChangePasswordDto, ChangePasswordSchema, useChangePassword } from '../User.Service';
// Components
import { Button, Input } from '@financeapp/frontend-common';

export const ChangePasswordFormComponent = (): ReactElement => {
  // Form Init ------------------------------------------------------
  const changePasswordForm = useForm<ChangePasswordDto>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  // Change password and toasts -------------------------------------
  const addToast = useAddToast();
  const changePassword = useChangePassword();
  const onPasswordChangeSubmit: SubmitHandler<ChangePasswordDto> = (data) =>
    changePassword.mutate(data);
  useEffect(() => {
    if (changePassword.status === 'success') {
      addToast({ message: 'Password changed', type: 'success' });
      changePasswordForm.reset();
    }
    if (changePassword.status === 'error')
      addToast({ message: changePassword.error?.message || 'Error', type: 'error' });
  }, [addToast, changePassword.status, changePassword.error?.message]);

  // Render ---------------------------------------------------------
  return (
    <section>
      <h2 className="text-2xl">Change Password</h2>
      <form onSubmit={changePasswordForm.handleSubmit(onPasswordChangeSubmit)}>
        <Input
          label="Old password"
          type="password"
          register={changePasswordForm.register('oldPassword')}
          error={changePasswordForm.formState.errors.oldPassword?.message}
          disabled={changePassword.isPending}
        />
        <div className="w-full md:gap-2 md:flex">
          <Input
            label="New password"
            type="password"
            register={changePasswordForm.register('newPassword')}
            error={changePasswordForm.formState.errors.newPassword?.message}
            disabled={changePassword.isPending}
          />
          <Input
            label="Confirm new password"
            type="password"
            register={changePasswordForm.register('confirmPassword')}
            error={changePasswordForm.formState.errors.confirmPassword?.message}
            disabled={changePassword.isPending}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </section>
  );
};
