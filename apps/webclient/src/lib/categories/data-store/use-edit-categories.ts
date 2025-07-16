import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CATEGORY_QUERY_KEY } from './use-categories';

interface EditCategoryDto {
  id: string;
  name: string;
  iconId: number;
}

export const useEditCategory = () => {
  const user = useUsers();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedCategory: EditCategoryDto) => {
      const token = (await user.getToken()) || '';

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/category/${updatedCategory.id}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCategory),
        }
      );

      return JSON.parse(await res.text() || '{}');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
