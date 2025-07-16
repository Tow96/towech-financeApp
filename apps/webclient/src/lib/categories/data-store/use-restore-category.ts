import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';

import { CATEGORY_QUERY_KEY } from './use-categories';

export const useRestoreCategory = () => {
  const user = useUsers();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = (await user.getToken()) || '';

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/category/${id}/restore`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      return JSON.parse((await res.text()) || '{}');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
