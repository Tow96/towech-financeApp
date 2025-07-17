import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CATEGORY_QUERY_KEY } from './use-categories';
import ApiClient from '@/lib/api';

interface AddSubCategoryDto {
  parentId: string;
  name: string;
  iconId: number;
}

export const useAddSubCategory = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddSubCategoryDto) =>
      api.post<{ id: string }>(`category/${data.parentId}/subcategory`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
