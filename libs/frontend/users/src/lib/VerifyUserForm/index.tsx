'use client';
import { ReactElement } from 'react';

import { redirect } from 'next/navigation';
import { useVerifyUserForm } from './VerifyUserForm.Hook';

import { Button, Input } from '@financeapp/frontend-common';

export const VerifyUserFormComponent = (): ReactElement => {
  const form = useVerifyUserForm();

  return (
    <section className="bg-riverbed-700 w-[31rem] rounded-3xl p-6">
      <h1 className="text-3xl font-bold">Verify account</h1>
      {form.status === 'success' && (
        <div className="mt-4 flex items-center">
          Email verified successfully!{' '}
          <Button text="Go to Login" onClick={() => redirect('/login')} />
        </div>
      )}
      {form.status !== 'success' && (
        <form onSubmit={form.onSubmit}>
          <Input label="E-Mail" register={form.email.register} error={form.email.error} />
          <Input label="Code" register={form.code.register} error={form.code.error} />
          <Button
            type="submit"
            text="Verify"
            disabled={form.status === 'pending'}
            loading={form.status === 'pending'}
          />
        </form>
      )}
    </section>
  );
};
