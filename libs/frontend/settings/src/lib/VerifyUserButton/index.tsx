'use client';
import { ReactElement } from 'react';
// Components
import { Button } from '@financeapp/frontend-common';
import { useVerifyUserButton } from './VerifyUserButton.Hook';

export const VerifyUserComponent = (): ReactElement => {
  const button = useVerifyUserButton();

  return (
    <section className="flex flex-col sm:flex-row">
      <div className="flex gap-4 items-end mb-2 sm:mb-0">
        <h2 className="text-2xl">Email status:</h2>
        <p
          role="caption"
          className={`font-extrabold text-xl ${
            button.isVerified ? 'text-mint-300' : 'text-cinnabar-300'
          }`}
        >
          {button.isVerified ? 'Verified' : 'Unverified'}
        </p>
      </div>
      {!button.isVerified && (
        <div className="flex flex-1 justify-end">
          <Button
            onClick={() => button.send()}
            disabled={button.isPending}
            loading={button.isPending}
          >
            Resend email
          </Button>
        </div>
      )}
    </section>
  );
};
