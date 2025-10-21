import { useQuery } from '@tanstack/react-query';
import { GetBalanceResponse, StatTimeframe } from '@towech-financeapp/shared';

import ApiClient from '@/lib/api';
import { useUsers } from '@/lib/users/use-users';

const balanceKeys = {
  all: ['stats', 'balance'] as const,
};

export const useBalanceQuery = (timeframe: StatTimeframe) => {
  const api = new ApiClient(useUsers().getToken());

  return useQuery({
    queryKey: [...balanceKeys.all, timeframe],
    queryFn: () => api.get<GetBalanceResponse>(`stats/balance?timeframe=${timeframe}`),
  });
};
