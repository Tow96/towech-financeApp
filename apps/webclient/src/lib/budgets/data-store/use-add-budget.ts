import { BudgetSummaryDto } from '@/lib/budgets/data-store/dto';
import { useUsers } from '@/lib/users/use-users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BUDGET_QUERY_KEY } from '@/lib/budgets/data-store/use-budgets';
import ApiClient from '@/lib/api';

interface AddBudgetDto {
  year: number;
  name: string;
  summary: BudgetSummaryDto[];
}

export const useAddBudget = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddBudgetDto) => api.post<{ id: string }>('budget', data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [BUDGET_QUERY_KEY] });
    },
  });
};
