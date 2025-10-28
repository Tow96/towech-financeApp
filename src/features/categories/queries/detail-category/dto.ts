import { z } from 'zod'
import type { CategoryType } from '@/features/categories/domain.ts'

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
})
export type RestoreCategorySchema = z.infer<typeof GetCategoryDetailSchema>
