import { z } from 'zod'

export type BalanceStatisicItemDto = {
	date: Date
	balance: number
	totalIncome: number
	totalExpense: number
}
export type BalanceStatisticDto = {
	previousPeriodEnd: BalanceStatisicItemDto
	items: Array<BalanceStatisicItemDto>
}

export const GetBalanceStatiscticRequest = z.object({
	periodStart: z.date(),
	periodEnd: z.date(),
})
export type GetBalanceStatiscticRequest = z.infer<typeof GetBalanceStatiscticRequest>

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
export type CashFlowStatisticItemDto = {
	date: Date
	in: number
	out: number
	net: number
}
export const GetCashFlowStatisticRequest = z.object({
	periodStart: z.date(),
	periodEnd: z.date(),
	mode: z.enum(['day', 'month']),
})
export type GetCashFlowStatisticRequest = z.infer<typeof GetCashFlowStatisticRequest>
