import { useQuery } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';
import ApiClient from '@/lib/api';

import { BudgetDto } from './dto';

export const BUDGET_QUERY_KEY = 'budgets';

export const useBudgets = () => {
  const api = new ApiClient(useUsers().getToken());

  return useQuery<BudgetDto[]>({
    queryKey: [BUDGET_QUERY_KEY],
    queryFn: () => api.get<BudgetDto[]>(`budget`),
  });
};
