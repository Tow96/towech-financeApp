'use client';
import { ReactElement } from 'react';

// Hooks
import { redirect } from 'next/navigation';

// Components
import { Button, Input } from '@financeapp/frontend-common';
import { useResetPasswordForm } from './ResetPasswordForm.Hook';

export const ResetPasswordFormComponent = (): ReactElement => {
  const form = useResetPasswordForm();

  return (
    <section className="bg-riverbed-700 w-[31rem] rounded-3xl p-6">
      <h1>Reset Password</h1>
      {form.resetStatus === 'success' && form.mode === 'reset' && (
        <div className="mt-4 flex items-center">
          Password reset successful!
          <Button text="Go to Login" onClick={() => redirect('/login')} />
        </div>
      )}
      <form onSubmit={form.onSubmit}>
        <Input label="E-Mail" register={form.email.register} error={form.email.error} />
        {form.mode === 'reset' && <Input label="Code" register={form.code.register} />}
        {form.mode === 'reset' && (
          <Input label="New Password" register={form.newPassword.register} />
        )}
        {form.mode === 'reset' && (
          <Input label="Confirm New Password" register={form.confirmPassword.register} />
        )}
        <div className="flex">
          <Button
            type="button"
            text={form.mode === 'send' ? 'I have a code' : "I don't have a code"}
            onClick={() => form.setMode(form.mode === 'send' ? 'reset' : 'send')}
          />
          <Button type="submit" text={form.mode === 'send' ? 'Send email' : 'Reset password'} />
        </div>
      </form>
    </section>
  );
};
