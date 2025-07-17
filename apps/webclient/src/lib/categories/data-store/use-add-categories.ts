import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CategoryType } from './dto';
import { CATEGORY_QUERY_KEY } from './use-categories';
import ApiClient from '@/lib/api';

interface AddCategoryDto {
  name: string;
  iconId: number;
  type: CategoryType;
}

export const useAddCategory = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCategoryDto) => api.post<{ id: string }>('category', data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
