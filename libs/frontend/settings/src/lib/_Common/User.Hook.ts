import { useAuthentication } from '@financeapp/frontend-authentication';
import { ApiContext } from '@financeapp/frontend-common';
import { useQuery } from '@tanstack/react-query';

type UserDto = {
  id: string;
  name: string;
  email: string;
  role: string;
  accountVerified: boolean;
};

export const TANSTACK_USER_KEY = 'user';

export const useUser = () => {
  const api = new ApiContext();
  const auth = useAuthentication();
  return useQuery({
    queryKey: [TANSTACK_USER_KEY],
    queryFn: async () =>
      await api.get<UserDto>(`users/${auth.data?.userId}`, auth.data?.token || ''),
    enabled: auth.isSuccess,
  });
};
