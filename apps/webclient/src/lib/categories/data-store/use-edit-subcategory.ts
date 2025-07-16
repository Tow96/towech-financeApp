import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CATEGORY_QUERY_KEY } from './use-categories';

interface EditSubCategoryDto {
  parentId: string;
  id: string;
  name: string;
  iconId: number;
}

export const useEditSubCategory = () => {
  const user = useUsers();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedSubCategory: EditSubCategoryDto) => {
      const token = (await user.getToken()) || '';

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/category/${updatedSubCategory.parentId}/subcategory/${updatedSubCategory.id}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSubCategory),
        }
      );

      return JSON.parse((await res.text()) || '{}');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
