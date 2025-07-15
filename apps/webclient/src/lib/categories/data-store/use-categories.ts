// External packages
import { useQuery } from '@tanstack/react-query';
import { CategoryDto } from '@/lib/categories/data-store';
import { useUsers } from '@/lib/users/use-users';

export const CATEGORY_QUERY_KEY = 'categories';

export const useCategories = () => {
  const user = useUsers();

  return useQuery<CategoryDto[]>({
    queryKey: [CATEGORY_QUERY_KEY],
    queryFn: async () => {
      const token = (await user.getToken()) || '';

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.json();
    },
  });
};
