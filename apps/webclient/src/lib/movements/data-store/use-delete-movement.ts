import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { MOVEMENT_QUERY_KEY } from '@/lib/movements/data-store/use-movements';
import ApiClient from '@/lib/api';

interface DeleteMovementDto {
  id: string;
}

export const useDeleteMovement = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteMovementDto) => api.delete<undefined>(`movement/${data.id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [MOVEMENT_QUERY_KEY] });
    },
  });
};
