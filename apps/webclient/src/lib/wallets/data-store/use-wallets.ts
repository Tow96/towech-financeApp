import { useQuery } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';
import ApiClient from '@/lib/api';

import { WalletDto } from './dto';

export const WALLET_QUERY_KEY = 'wallets';

export const useWallets = () => {
  const api = new ApiClient(useUsers().getToken());

  return useQuery<WalletDto[]>({
    queryKey: [WALLET_QUERY_KEY],
    queryFn: () => api.get<WalletDto[]>('wallet'),
  });
};
