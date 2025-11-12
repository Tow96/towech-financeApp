import { z } from 'zod'
import type { CategoryType } from '@/features/categories/domain.ts'

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
	periodStart: z.date(),
})
