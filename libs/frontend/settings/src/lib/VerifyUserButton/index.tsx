'use client';
import { ReactElement } from 'react';
// Components
import { Button } from '@financeapp/frontend-common';
import { useUser, useVerifyUser } from '../_Common';

export const VerifyUserComponent = (): ReactElement => {
  const { data: user } = useUser();
  const button = useVerifyUser();

  return (
    <section className="flex flex-col sm:flex-row">
      <div className="mb-2 flex items-end gap-4 sm:mb-0">
        <h2 className="text-2xl">Email status:</h2>
        <p
          role="caption"
          className={`text-xl font-extrabold ${
            user?.accountVerified ? 'text-mint-300' : 'text-cinnabar-300'
          }`}
        >
          {user?.accountVerified ? 'Verified' : 'Unverified'}
        </p>
      </div>
      {!user?.accountVerified && (
        <div className="flex flex-1 justify-end">
          <Button
            text="Resend email"
            onClick={() => button.send(user?.id || '')}
            disabled={button.isPending}
            loading={button.isPending}
          />
        </div>
      )}
    </section>
  );
};
