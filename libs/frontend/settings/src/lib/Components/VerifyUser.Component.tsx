'use client';
import { ReactElement, useEffect } from 'react';
// Hooks
import { useSendVerification, useUser } from '../User.Service';
import { useAddToast } from '@financeapp/frontend-toasts';
// Components
import { Button } from '@financeapp/frontend-common';

export const VerifyUserComponent = (): ReactElement => {
  const { data: user } = useUser();

  // Verification email sending -------------------------------------
  const sendVerificationEmail = useSendVerification();
  const addToast = useAddToast();
  useEffect(() => {
    if (sendVerificationEmail.status === 'success')
      addToast({ message: 'Email sent', type: 'success' });
    if (sendVerificationEmail.status === 'error')
      addToast({ message: sendVerificationEmail.error?.message || 'Error', type: 'error' });
  }, [addToast, sendVerificationEmail.status, sendVerificationEmail.error?.message]);

  // Render ---------------------------------------------------------
  return (
    <section className="flex flex-col sm:flex-row">
      <div className="flex gap-4 items-end mb-2 sm:mb-0">
        <h2 className="text-2xl">Email status:</h2>
        <p
          role="caption"
          className={`font-extrabold text-xl ${
            user?.accountVerified ? 'text-mint-300' : 'text-cinnabar-300'
          }`}
        >
          {user?.accountVerified ? 'Verified' : 'Unverified'}
        </p>
      </div>
      {!user?.accountVerified && (
        <div className="flex flex-1 justify-end">
          <Button
            onClick={() => sendVerificationEmail.mutate()}
            disabled={sendVerificationEmail.isPending}
            loading={sendVerificationEmail.isPending}
          >
            Resend email
          </Button>
        </div>
      )}
    </section>
  );
};
