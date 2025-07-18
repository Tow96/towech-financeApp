import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { WALLET_QUERY_KEY } from './use-wallets';
import ApiClient from '@/lib/api';

interface AddWalletDto {
  name: string;
  iconId: string;
}

export const useAddWallet = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddWalletDto) => api.post<{ id: string }>('wallet', data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [WALLET_QUERY_KEY] });
    },
  });
};
