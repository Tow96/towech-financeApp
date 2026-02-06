import { useQuery } from '@tanstack/react-query'
import { graphKeys } from '../utils'
import { getBalanceStatistic } from '@/core/functions'

// Queries --------------------------------------
export const useBalanceStatistic = (periodStart: Date, periodEnd: Date) => {
	return useQuery({
		queryKey: graphKeys.balance(periodStart, periodEnd),
		queryFn: () => getBalanceStatistic({ data: { periodStart, periodEnd } }),
	})
}
