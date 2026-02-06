import { z } from 'zod'

export type GetBalanceStatisicItemDto = {
	date: Date
	balance: number
	totalIncome: number
	totalExpense: number
}

export const GetBalanceStatiscticSchema = z.object({
	periodStart: z.date(),
	periodEnd: z.date(),
})
