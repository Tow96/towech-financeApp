import { z } from 'zod'

export type GetCashFlowStatisticItemDto = {
	date: Date
	in: number
	out: number
	net: number
}

export const GetCashFlowStatisticSchema = z.object({
	periodStart: z.date(),
	periodEnd: z.date(),
})
