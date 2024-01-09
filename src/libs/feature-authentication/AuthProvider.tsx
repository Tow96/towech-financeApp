/** AuthProvider.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Provider that handles token revalidation when reloading
 */
'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

import { Spinner } from '@/components/spinner';
import { useAuth } from '@/libs/feature-authentication/UserService';

type Props = {
  children: React.ReactNode;
  auth?: boolean;
};

export const AuthProvider = ({ children, auth = true }: Props): JSX.Element => {
  const user = useAuth();
  useEffect(() => {
    if (user.status !== 'pending') {
      if (auth && user.status === 'error') redirect('/login');
      if (!auth && user.status === 'success') redirect('/dashboard');
    }
  }, [user.status, user.data, auth]);

  // Render -------------------------------------------------------------------
  if (!user.isPending) return <>{children}</>;
  return (
    <div className="flex h-screen w-full items-center justify-center" data-testid="auth-loading">
      <Spinner />
    </div>
  );
};
