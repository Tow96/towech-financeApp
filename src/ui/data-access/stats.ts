import { useQuery } from '@tanstack/react-query'
import { graphKeys } from '../utils'
import {
	getBalancePerWalletStatistic,
	getBalanceTrendStatistic,
	getCashFlowStatistic,
	getCashFlowTrendStatistic,
	getCategoryStatistic,
} from '@/core/functions'

// Queries --------------------------------------
export const useBalanceStatistic = (periodStart: Date, periodEnd: Date) => {
	return useQuery({
		queryKey: graphKeys.balanceTrend(periodStart, periodEnd),
		queryFn: () => getBalanceTrendStatistic({ data: { periodStart, periodEnd } }),
	})
}

export const useBalancePerWalletStatistic = (periodEnd: Date) => {
	return useQuery({
		queryKey: graphKeys.balanceWallet(periodEnd),
		queryFn: () => getBalancePerWalletStatistic({ data: { periodEnd } }),
	})
}

export const useCashFlowStatistic = (periodStart: Date, periodEnd: Date) => {
	return useQuery({
		queryKey: graphKeys.cashFlowPeriod(periodStart, periodEnd),
		queryFn: () => getCashFlowStatistic({ data: { periodStart, periodEnd } }),
	})
}

export const useCashFlowTrendStatistic = (periodStart: Date, periodEnd: Date) => {
	return useQuery({
		queryKey: graphKeys.cashFlowTrend(periodStart, periodEnd),
		queryFn: () => getCashFlowTrendStatistic({ data: { periodStart, periodEnd } }),
	})
}

export const useCategoryReportStatistic = (periodStart: Date, periodEnd: Date) => {
	return useQuery({
		queryKey: graphKeys.categoryReport(periodStart, periodEnd),
		queryFn: () => getCategoryStatistic({ data: { periodStart, periodEnd } }),
	})
}
