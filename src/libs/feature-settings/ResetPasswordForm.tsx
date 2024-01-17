/** ResetPasswordForm.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Form that hanldes sending reset password emails
 */
'use client';
// Hooks ----------------------------------------------------------------------
import { useEffect } from 'react';
import { usePasswordReset } from '@/libs/feature-authentication/UserService';
import { useAddToast } from '@/libs/feature-toasts/ToastService';
// Used Components ------------------------------------------------------------
import { Button } from '@/components/button';

// Component ------------------------------------------------------------------
export const ResetPasswordForm = (): JSX.Element => {
  const addToast = useAddToast();

  const resetPass = usePasswordReset();
  useEffect(() => {
    if (resetPass.status === 'success') addToast({ message: 'Email sent', type: 'success' });
    if (resetPass.status === 'error')
      addToast({ message: resetPass.error?.message || 'Error', type: 'error' });
  }, [addToast, resetPass.status, resetPass.error?.message]);

  return (
    <section className="flex flex-col sm:flex-row">
      <h2 className="text-2xl">Forgotten Password</h2>
      <div className="flex flex-1 justify-end">
        <Button
          disabled={resetPass.isPending}
          loading={resetPass.isPending}
          onClick={() => resetPass.mutate()}>
          Reset
        </Button>
      </div>
    </section>
  );
};
