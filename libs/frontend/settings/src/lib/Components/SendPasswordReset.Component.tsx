'use client';
import { ReactElement, useEffect } from 'react';
// Hooks
import { useAddToast } from '@financeapp/frontend-toasts';
import { usePasswordReset } from '../User.Service';
import { useAuthentication } from '@financeapp/frontend-authentication';
// Components
import { Button } from '@financeapp/frontend-common';

export const SendPasswordResetComponent = (): ReactElement => {
  const { data: user } = useAuthentication();
  const addToast = useAddToast();
  const resetPass = usePasswordReset();
  useEffect(() => {
    if (resetPass.status === 'success') addToast({ message: 'Email sent', type: 'success' });
    if (resetPass.status === 'error')
      addToast({ message: resetPass.error?.message || 'Error', type: 'error' });
  }, [addToast, resetPass.status, resetPass.error?.message]);

  // Return ---------------------------------------------------------
  return (
    <section className="flex flex-col sm:flex-row">
      <h2 className="text-2xl">Forgotten Password</h2>
      <div className="flex flex-1 justify-end">
        <Button
          disabled={resetPass.isPending}
          loading={resetPass.isPending}
          onClick={() => resetPass.mutate(user?.userId || '')}
        >
          Send reset email
        </Button>
      </div>
    </section>
  );
};
