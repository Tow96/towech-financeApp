import { useQuery } from '@tanstack/react-query';
// import ApiClient from '@/lib/api';
// import { useUsers } from '@/lib/users/use-users';

const balanceKeys = {
  all: ['stats', 'balance'] as const,
};

const data = [
  { day: 'Monday', balance: 186 },
  { day: 'Tuesday', balance: 305 },
  { day: 'Wednesday', balance: 237 },
  { day: 'Thursday', balance: 150 },
  { day: 'Friday', balance: 209 },
  { day: 'Saturday', balance: 214 },
  { day: 'Sunday', balance: 350 },
];

export const useBalanceQuery = () => {
  // const api = new ApiClient(useUsers().getToken());

  return useQuery({
    queryKey: balanceKeys.all,
    queryFn: () => data,
  });
};
