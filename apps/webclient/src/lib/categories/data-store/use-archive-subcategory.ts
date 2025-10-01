import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CATEGORY_QUERY_KEY } from './use-categories';
import ApiClient from '@/lib/api';

interface ArchiveSubCategoryDto {
  parentId: string;
  id: string;
}

export const useArchiveSubCategory = () => {
  const api = new ApiClient(useUsers().getToken());
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ArchiveSubCategoryDto) =>
      api.put<undefined>(`category/${data.parentId}/subcategory/${data.id}/archive`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
