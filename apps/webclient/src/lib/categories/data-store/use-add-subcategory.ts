import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CATEGORY_QUERY_KEY } from './use-categories';

interface AddSubCategoryDto {
  parentId: string;
  name: string;
  iconId: number;
}

export const useAddSubCategory = () => {
  const user = useUsers();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSubCategory: AddSubCategoryDto) => {
      const token = (await user.getToken()) || '';

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/category/${newSubCategory.parentId}/subcategory`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(newSubCategory),
        }
      );

      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
