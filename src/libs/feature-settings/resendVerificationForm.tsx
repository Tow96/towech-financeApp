/** resendVerificationForm.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Form that is used to re-verify an email
 */
'use client';
// Libraries ------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------
import { useAuth, useResendMail } from '@/libs/feature-authentication/UserService';
import { useAddToast } from '@/libs/feature-toasts/ToastService';
// Used Components ------------------------------------------------------------
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Spinner } from '@/components/spinner';
// Types ----------------------------------------------------------------------

// Component ------------------------------------------------------------------
export const ResendVerificationForm = (): JSX.Element => {
  const { data: user } = useAuth();
  const resendMail = useResendMail();

  const addToast = useAddToast();

  return (
    <section data-testid="mail-status">
      <h2>Email status:</h2>
      <span role="caption">{user?.accountConfirmed ? 'Verified' : 'Unverified'}</span>
      {!user?.accountConfirmed && (
        <Button onClick={() => resendMail.mutate()}>Resend verification email</Button>
      )}
    </section>
  );
};
