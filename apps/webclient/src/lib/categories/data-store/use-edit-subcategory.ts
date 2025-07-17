import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CATEGORY_QUERY_KEY } from './use-categories';
import ApiClient from '@/lib/api';

interface EditSubCategoryDto {
  parentId: string;
  id: string;
  name: string;
  iconId: number;
}

export const useEditSubCategory = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditSubCategoryDto) =>
      api.put<undefined>(`category/${data.parentId}/subcategory/${data.id}`, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
