import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CategoryType } from './dto';
import { CATEGORY_QUERY_KEY } from './use-categories';

interface AddCategoryDto {
  name: string;
  iconId: string;
  type: CategoryType;
}

export const useAddCategory = () => {
  const user = useUsers();
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newCategory: AddCategoryDto) => {
      const token = (await user.getToken()) || '';

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/category`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(CATEGORY_QUERY_KEY);
    }
  });
};
