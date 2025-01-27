'use client';
import { ReactElement, ReactNode, useEffect } from 'react';
import { redirect } from 'next/navigation';

import { SpinnerComponent } from '@financeapp/frontend-common';
import { useAuthentication } from './Authentication.Service';

type Props = {
  children: ReactNode;
  protectedRoute?: boolean;
};

export const AuthenticationProvider = ({
  children,
  protectedRoute = true,
}: Props): ReactElement => {
  const user = useAuthentication();
  useEffect(() => {
    if (user.status !== 'pending') {
      if (protectedRoute && user.status === 'error') redirect('/login');
      if (!protectedRoute && user.status === 'success') redirect('/dashboard');
    }
  }, [user.status, user.data, protectedRoute]);

  // Render -------------------------------------------------------------------
  if (!user.isPending) return <>{children}</>;
  return (
    <div className="flex h-screen w-full items-center justify-center" data-testid="auth-loading">
      <SpinnerComponent />
    </div>
  );
};
