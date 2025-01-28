'use client';
import { ReactElement } from 'react';
// Hooks
import { useForm } from 'react-hook-form';
import { ChangePasswordDto } from '../User.Service';
// Components
import { Button, Input } from '@financeapp/frontend-common';

export const ChangePasswordFormComponent = (): ReactElement => {
  // Form Init ------------------------------------------------------
  const changePasswordForm = useForm<ChangePasswordDto>;

  return (
    <section>
      <h2 className="text-2xl">Change Password</h2>
      <form>
        <Input label="Old password" type="password" />
        <div className="w-full gap-2 md:flex">
          <Input label="New password" type="password" />
          <Input label="Confirm new password" type="password" />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </section>
  );
};
