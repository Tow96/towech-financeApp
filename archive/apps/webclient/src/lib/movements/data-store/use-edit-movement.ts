import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { WALLET_QUERY_KEY } from '@/lib/wallets/data-store';
import { CategoryType } from '@/lib/categories/data-store';
import { MOVEMENT_QUERY_KEY } from './use-movements';
import ApiClient from '@/lib/api';
import { SummaryDto } from './dto';

export interface EditMovementDto {
  id: string;
  category: {
    type: CategoryType;
    id: string | null;
    subId: string | null;
  };
  date: Date;
  description: string;
  summary: SummaryDto[];
}

export const useEditMovement = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditMovementDto) => api.put<undefined>(`movement/${data.id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [MOVEMENT_QUERY_KEY] });
      await queryClient.invalidateQueries({ queryKey: [WALLET_QUERY_KEY] });
    },
  });
};
