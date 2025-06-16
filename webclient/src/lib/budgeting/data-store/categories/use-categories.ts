import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { CategoryDto } from '@/lib/budgeting/data-store/categories/dto';

interface GetAllCategoriesDto {
  Income: CategoryDto[];
  Expense: CategoryDto[];
}

export const CATEGORY_QUERY_KEY = 'categories';

export const useCategories = () => {
  // const auth = useAuth();

  return useQuery<GetAllCategoriesDto>({
    queryKey: [CATEGORY_QUERY_KEY],
    queryFn: async () => {
      // const token = (await auth.getToken()) || '';
      const token = '';

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.json();
    },
  });
};
