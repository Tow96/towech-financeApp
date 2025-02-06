'use client';
import { ReactElement } from 'react';
// Components
import { Button, Input } from '@financeapp/frontend-common';
import { useChangePasswordForm } from './ChangePasswordForm.Hook';

export const ChangePasswordFormComponent = (): ReactElement => {
  const form = useChangePasswordForm();

  return (
    <section>
      <h2 className="text-2xl">Change Password</h2>
      <form onSubmit={form.onSubmit}>
        <Input
          label="Old password"
          type="password"
          register={form.oldPassword.register}
          error={form.oldPassword.error}
          disabled={form.isPending}
        />
        <div className="w-full md:gap-2 md:flex">
          <Input
            label="New password"
            type="password"
            register={form.newPassword.register}
            error={form.newPassword.error}
            disabled={form.isPending}
          />
          <Input
            label="Confirm new password"
            type="password"
            register={form.confirmPassword.register}
            error={form.confirmPassword.error}
            disabled={form.isPending}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </section>
  );
};
