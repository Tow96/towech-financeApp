import { z } from 'zod'
import { CategoryType } from '@/features/categories/domain'

export type CategoryListItemDto = {
	iconId: number
	type: CategoryType
	id: string
	name: string
	subCategories: Array<SubCategoryListItemDto>
	archived: boolean
}

export type SubCategoryListItemDto = {
	iconId: number
	id: string
	name: string
	archived: boolean
}

export const GetCategoryListSchema = z.object({
	type: z.enum(CategoryType),
})
