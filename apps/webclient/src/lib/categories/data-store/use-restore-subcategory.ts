import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CATEGORY_QUERY_KEY } from './use-categories';
import ApiClient from '@/lib/api';

interface RestoreSubCategoryDto {
  parentId: string;
  id: string;
}

export const useRestoreSubCategory = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RestoreSubCategoryDto) =>
      api.put(`category/${data.parentId}/subcategory/${data.id}/restore`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
