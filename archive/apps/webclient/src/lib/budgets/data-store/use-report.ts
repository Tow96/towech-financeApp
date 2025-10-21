import { useQuery } from '@tanstack/react-query';
import { useUsers } from '@/lib/users/use-users';
import ApiClient from '@/lib/api';

import { ReportDto } from './dto';

export const REPORT_QUERY_KEY = 'reports';

export const useReport = (year: string) => {
  const api = new ApiClient(useUsers().getToken());

  return useQuery<ReportDto[]>({
    queryKey: [REPORT_QUERY_KEY, year],
    queryFn: () => api.get<ReportDto[]>(`budget/report?year=${year}`),
  });
};
