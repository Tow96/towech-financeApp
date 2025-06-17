import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const disabledUsers = process.env.NEXT_PUBLIC_USERS_DISABLED === 'true';

  if (disabledUsers) return children;
  return <ClerkProvider>{children}</ClerkProvider>;
};
