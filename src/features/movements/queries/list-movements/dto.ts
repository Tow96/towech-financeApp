import { z } from 'zod'
import type { CategoryType } from '@/features/categories/domain'

export type ListMovementItemDto = {
	id: string
	date: Date
	description: string
	amount: number

	category: {
		type: CategoryType
		id: string | null
		subId: string | null
	}
	wallet: {
		originId: string | null
		destinationId: string | null
	}
}

export const GetMovementListSchema = z.object({
	walletId: z.string().optional(),
	periodStart: z.date(),
})
