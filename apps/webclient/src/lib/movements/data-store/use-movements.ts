import { useQuery } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';
import ApiClient from '@/lib/api';

import { MovementDto } from './dto';

export const MOVEMENT_QUERY_KEY = 'movements';

export const useMovements = () => {
  const api = new ApiClient(useUsers().getToken());

  return useQuery<MovementDto[]>({
    queryKey: [MOVEMENT_QUERY_KEY],
    queryFn: () => api.get<MovementDto[]>('movement'),
  });
};
