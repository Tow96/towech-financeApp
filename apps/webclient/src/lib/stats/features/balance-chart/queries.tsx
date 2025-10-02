import { useQuery } from '@tanstack/react-query';
import { GetBalanceWeekResponse } from '@towech-financeapp/shared';

import ApiClient from '@/lib/api';
import { useUsers } from '@/lib/users/use-users';

const balanceKeys = {
  all: ['stats', 'balance'] as const,
};

export const useBalanceQuery = () => {
  const api = new ApiClient(useUsers().getToken());

  return useQuery({
    queryKey: balanceKeys.all,
    queryFn: () => api.get<GetBalanceWeekResponse>(`stats/balance/week`),
  });
};
