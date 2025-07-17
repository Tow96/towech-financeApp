import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CATEGORY_QUERY_KEY } from './use-categories';
import ApiClient from '@/lib/api';

export const useArchiveCategory = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.put<undefined>(`category/${id}/archive`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
