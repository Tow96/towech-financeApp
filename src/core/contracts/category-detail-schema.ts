import { z } from 'zod'

import type { Category } from '@/core/entities'
import { CategoryType } from '@/core/entities'

export type CategoryDetailDto = {
	iconId: number
	type: CategoryType
	id: string
	subId: string | null
	name: string
	archived: boolean
}

export const mapEntityToCategoryDetail = (category: Category): CategoryDetailDto => ({
	type: category.type,
	id: category.id,
	subId: category.subId,
	iconId: category.iconId,
	name: category.name,
	archived: category.archived,
})

export const GetCategoryDetailSchema = z.object({
	type: z.enum(CategoryType),
	id: z.uuid(),
	subId: z.uuid().optional(),
})
export type RestoreCategorySchema = z.infer<typeof GetCategoryDetailSchema>
