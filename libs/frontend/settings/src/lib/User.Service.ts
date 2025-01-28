import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiContext, TanstackKeys } from '@financeapp/frontend-common';
import { AuthenticationDto, useAuthentication } from '@financeapp/frontend-authentication';

// Models -----------------------------------------------------------
type UserDto = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type EditUserDto = {
  name: string;
  email: string;
};

// Adapter ----------------------------------------------------------
const api = new ApiContext();

export const useUser = () => {
  const auth = useAuthentication();
  return useQuery({
    queryKey: [TanstackKeys.USER],
    queryFn: async () =>
      await api.get<UserDto>(`users/${auth.data?.userId}`, auth.data?.token || ''),
    enabled: auth.isSuccess,
  });
};

export const useEditUser = () => {
  const client = useQueryClient();

  const { data: auth } = useAuthentication();
  const { data: user } = useUser();

  return useMutation({
    mutationKey: [TanstackKeys.USER, 'update'],
    mutationFn: async (data: EditUserDto) => {
      if (auth) await api.patch(`users/${auth.userId}`, auth.token, data);
      else throw Error('Not authorized');
      return data;
    },
    onSuccess: (res) => client.setQueryData([TanstackKeys.USER], { ...user, ...res }),
  });
};
