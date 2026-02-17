import { z } from 'zod'

export type GetBalanceStatisicItemDto = {
	date: Date
	balance: number
	totalIncome: number
	totalExpense: number
}
export const GetBalanceStatiscticRequest = z.object({
	periodStart: z.date(),
	periodEnd: z.date(),
})
export type GetBalanceStatiscticRequest = z.infer<typeof GetBalanceStatiscticRequest>

// ----------------------------------------------
export type GetCashFlowStatisticItemDto = {
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

