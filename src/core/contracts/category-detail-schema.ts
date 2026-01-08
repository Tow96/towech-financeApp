import { z } from 'zod'
import type { CategoryType } from '@/core/entities'

export type CategoryDetailDto = {
	iconId: number
	type: CategoryType
	id: string
	subId: string | null
	name: string
	archived: boolean
}

export const GetCategoryDetailSchema = z.object({
	id: z.uuid(),
	subId: z.uuid().optional(),
})
export type RestoreCategorySchema = z.infer<typeof GetCategoryDetailSchema>
