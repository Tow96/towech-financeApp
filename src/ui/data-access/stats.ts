import { useQuery } from '@tanstack/react-query'
import { graphKeys } from '../utils'
import {
	getBalancePerWalletStatistic,
	getBalanceStatistic,
	getCashFlowStatistic,
} from '@/core/functions'

// Queries --------------------------------------
export const useBalanceStatistic = (periodStart: Date, periodEnd: Date) => {
	return useQuery({
		queryKey: graphKeys.balanceTrend(periodStart, periodEnd),
		queryFn: () => getBalanceStatistic({ data: { periodStart, periodEnd } }),
	})
}

export const useBalancePerWalletStatistic = (periodEnd: Date) => {
	return useQuery({
		queryKey: graphKeys.balanceWallet(periodEnd),
		queryFn: () => getBalancePerWalletStatistic({ data: { periodEnd } }),
	})
}

export const useCashFlowStatistic = (periodStart: Date, periodEnd: Date, mode: 'day' | 'month') => {
	return useQuery({
		queryKey: graphKeys.cashFlow(periodStart, periodEnd, mode),
		queryFn: () => getCashFlowStatistic({ data: { periodStart, periodEnd, mode } }),
	})
}
