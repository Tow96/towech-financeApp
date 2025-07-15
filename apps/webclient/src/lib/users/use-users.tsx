import { useAuth } from '@clerk/clerk-react';

export const useUsers = () => {
  const disabledUsers = process.env.NEXT_PUBLIC_USERS_DISABLED === 'true';

  if (disabledUsers) return { getToken: () => '' };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useAuth();
};
