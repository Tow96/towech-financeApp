import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { WALLET_QUERY_KEY } from './use-wallets';
import ApiClient from '@/lib/api';

interface ArchiveWalletDto {
  id: string;
  restore: boolean;
}

export const useArchiveWallet = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ArchiveWalletDto) =>
      api.put<undefined>(`wallet/${data.id}/archive?restore=${data.restore ? '1' : '0'}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [WALLET_QUERY_KEY] });
    },
  });
};
