import { z } from 'zod'

import type { CategoryType } from '@/core/domain'

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
export type CashFlowStatisticDto = {
	previousPeriodEnd: number
	in: number
	out: number
	net: number
}

export const GetCashFlowStatisticRequest = z.object({ periodStart: z.date(), periodEnd: z.date() })
export type GetCashFlowStatisticRequest = z.infer<typeof GetCashFlowStatisticRequest>

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
export type SubCategoryStatisticItemDto = {
	subId: string | null
	previousAmount: number
	currentAmount: number
}
export type CategoryStatisticItemDto = {
	id: string | null
	previousAmount: number
	currentAmount: number
	subCategories: Array<SubCategoryStatisticItemDto>
}
export type CategoryReportStatisticDto = {
	type: CategoryType
	previousAmount: number
	currentAmount: number
	categories: Array<CategoryStatisticItemDto>
}

export const GetCategoryStatisticRequest = z.object({
	periodStart: z.date(),
	periodEnd: z.date(),
})
export type GetCategoryStatisticRequest = z.infer<typeof GetCategoryStatisticRequest>
