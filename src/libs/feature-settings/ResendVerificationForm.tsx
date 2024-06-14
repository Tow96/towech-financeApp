/** resendVerificationForm.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Form that is used to re-verify an email
 */
'use client';
// Hooks ----------------------------------------------------------------------
import { useEffect } from 'react';
import { useAuth, useResendMail } from '@/libs/feature-authentication/UserService';
import { useAddToast } from '@/libs/feature-toasts';
// Used Components ------------------------------------------------------------
import { Button } from '@/components/button';

// Component ------------------------------------------------------------------
export const ResendVerificationForm = (): JSX.Element => {
  const { data: user } = useAuth();
  const resendMail = useResendMail();

  const addToast = useAddToast();

  useEffect(() => {
    if (resendMail.status === 'success') addToast({ message: 'Email sent', type: 'success' });
    if (resendMail.status === 'error')
      addToast({ message: resendMail.error?.message || 'Error', type: 'error' });
  }, [addToast, resendMail.status, resendMail.error?.message]);

  return (
    <section data-testid="mail-status">
      <h2 className="mb-2 text-2xl">Email status:</h2>
      <div className="flex items-center gap-12">
        <p
          role="caption"
          className={`${user?.accountConfirmed ? 'text-mint-300' : 'text-cinnabar-300'} font-extrabold`}>
          {user?.accountConfirmed ? 'Verified' : 'Unverified'}
        </p>
        {!user?.accountConfirmed && (
          <Button
            onClick={() => resendMail.mutate()}
            disabled={resendMail.isPending}
            loading={resendMail.isPending}>
            Resend email
          </Button>
        )}
      </div>
    </section>
  );
};
