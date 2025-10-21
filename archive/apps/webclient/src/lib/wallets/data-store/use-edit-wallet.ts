import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { WALLET_QUERY_KEY } from './use-wallets';
import ApiClient from '@/lib/api';

interface EditWalletDto {
  id: string;
  name: string;
  iconId: number;
}

export const useEditWallet = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditWalletDto) => api.put<undefined>(`wallet/${data.id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [WALLET_QUERY_KEY] });
    },
  });
};
