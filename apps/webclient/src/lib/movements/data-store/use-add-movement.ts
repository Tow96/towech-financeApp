import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { MOVEMENT_QUERY_KEY } from './use-movements';
import ApiClient from '@/lib/api';
import { SummaryDto } from './dto';
import { CategoryType } from 'backend/dist/lib/categories/dto';

export interface AddMovementDto {
  category: {
    type: CategoryType;
    id: string | null;
    subId: string | null;
  };
  date: Date;
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
    },
  });
};
