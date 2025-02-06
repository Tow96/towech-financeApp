'use client';
import { ReactElement } from 'react';
// Hooks
import { usePasswordReset } from './SendPasswordReset.Hook';
// Components
import { Button } from '@financeapp/frontend-common';

export const SendPasswordResetButtonComponent = (): ReactElement => {
  const button = usePasswordReset();

  return (
    <section className="flex flex-col sm:flex-row">
      <h2 className="text-2xl">Forgotten Password</h2>
      <div className="flex flex-1 justify-end">
        <Button
          text="Send reset email"
          disabled={button.isPending}
          loading={button.isPending}
          onClick={() => button.send()}
        />
      </div>
    </section>
  );
};
