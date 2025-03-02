import { useAuthentication } from '@financeapp/frontend-authentication';
import { ApiContext } from '@financeapp/frontend-common';
import { useQuery } from '@tanstack/react-query';

type UsersDto = {
  id: string;
  name: string;
  email: string;
  role: string;
  accountVerified: boolean;
};

export const TANSTACK_USERS_KEY = 'users';

export const useManageUsers = () => {
  const api = new ApiContext();
  const auth = useAuthentication();

  return useQuery({
    queryKey: [TANSTACK_USERS_KEY],
    queryFn: async () => await api.get<UsersDto[]>(`users/`, auth.data?.token || ''),
    enabled: auth.isSuccess,
  });
};
