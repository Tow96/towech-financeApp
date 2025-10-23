import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { MOVEMENT_QUERY_KEY } from './use-movements';
import ApiClient from '@/lib/api';
import { SummaryDto } from './dto';
import { WALLET_QUERY_KEY } from '@/lib/wallets/data-store';
import { CategoryType } from '@/lib/categories/data-store';

export interface AddMovementDto {
  category: {
    type: CategoryType;
    id: string | null;
    subId: string | null;
  };
  date: string;
  description: string;
  summary: SummaryDto[];
}

export const useAddMovement = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMovementDto) => api.post<{ id: string }>('movement', data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [MOVEMENT_QUERY_KEY] });
      await queryClient.invalidateQueries({ queryKey: [WALLET_QUERY_KEY] });
    },
  });
};
