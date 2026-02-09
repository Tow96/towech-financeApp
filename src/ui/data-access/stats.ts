import { useQuery } from '@tanstack/react-query'
import { graphKeys } from '../utils'
import { getBalanceStatistic, getCashFlowStatistic } from '@/core/functions'

// Queries --------------------------------------
export const useBalanceStatistic = (periodStart: Date, periodEnd: Date) => {
	return useQuery({
		queryKey: graphKeys.balance(periodStart, periodEnd),
		queryFn: () => getBalanceStatistic({ data: { periodStart, periodEnd } }),
	})
}

export const useCashFlowStatistic = (periodStart: Date, periodEnd: Date, mode: 'day' | 'month') => {
	return useQuery({
		queryKey: graphKeys.cashFlow(periodStart, periodEnd, mode),
		queryFn: () => getCashFlowStatistic({ data: { periodStart, periodEnd, mode } }),
	})
}
