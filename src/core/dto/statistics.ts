import { z } from 'zod'

export type BalanceStatisicTrendItemDto = {
	date: Date
	balance: number
	totalIncome: number
	totalExpense: number
}
export type BalanceStatisticTrendDto = {
	previousPeriodEnd: BalanceStatisicTrendItemDto
	items: Array<BalanceStatisicTrendItemDto>
}

export const GetBalanceStatiscticTrendRequest = z.object({
	periodStart: z.date(),
	periodEnd: z.date(),
})
export type GetBalanceStatiscticTrendRequest = z.infer<typeof GetBalanceStatiscticTrendRequest>

// ----------------------------------------------
export type BalancePerWalletStatisticDto = {
	walletId: string
	income: number
	expense: number
	total: number
}
export const GetBalancePerWalletStatisticRequest = z.object({ periodEnd: z.date() })
export type GetBalancePerWalletStatisticRequest = z.infer<
	typeof GetBalancePerWalletStatisticRequest
>

// ----------------------------------------------
export type CashFlowTrendStatisticItemDto = {
	date: Date
	in: number
	out: number
	net: number
}

export const GetCashFlowTrendStatisticRequest = z.object({
	periodStart: z.date(),
	periodEnd: z.date(),
})
export type GetCashFlowTrendStatisticRequest = z.infer<typeof GetCashFlowTrendStatisticRequest>

// ----------------------------------------------
export type CashFlowStatisticTrendLegacyItemDto = {
	date: Date
	in: number
	out: number
	net: number
}
export const GetCashFlowStatisticTrendLegacyRequest = z.object({
	periodStart: z.date(),
	periodEnd: z.date(),
	mode: z.enum(['day', 'month']),
})
export type GetCashFlowStatisticTrendLegacyRequest = z.infer<
	typeof GetCashFlowStatisticTrendLegacyRequest
>
