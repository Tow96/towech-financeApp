import { z } from 'zod'
import type { CategoryType } from '@/features/categories/domain'

export type MovementDetailDto = {
	id: string
	amount: number
	date: Date
	description: string
	category: {
		type: CategoryType,
		id: string | null,
		subId: string | null,
	}
	wallet: {
		originId: string | null,
		destinationId: string | null,
	}
}

export const GetMovementDetailSchema = z.object({
	id: z.uuid()
})
export type GetMovementDetailSchema = z.infer<typeof GetMovementDetailSchema>