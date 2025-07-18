// External packages
import { useQuery } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';
import ApiClient from '@/lib/api';

import { CategoryDto } from './dto';

export const CATEGORY_QUERY_KEY = 'categories';

export const useCategories = () => {
  const api = new ApiClient(useUsers().getToken());

  return useQuery<CategoryDto[]>({
    queryKey: [CATEGORY_QUERY_KEY],
    queryFn: () => api.get<CategoryDto[]>('/category'),
  });
};
