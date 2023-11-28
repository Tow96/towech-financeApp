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

  // TODO: This redirects each time the token changes, this needs to be fixed
  useEffect(() => {
    if (!user.isPending) {
      if (auth && user.isError) redirect('/login');
      if (!auth && user.isSuccess) redirect('/dashboard');
    }
  }, [user.status, user.data, auth, user]);

  return (
    <>
      {user.isPending ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </>
  );
};
