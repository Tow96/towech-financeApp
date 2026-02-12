import { z } from 'zod'
import { CategoryType } from '@/core/domain'

export type CategoryListItemDto =
	// top category
	| {
			iconId: number
			type: CategoryType
			id: string
			subId: null
			name: string
			subCategories: Array<CategoryListItemDto>
			archived: boolean
	  }
	// 	sub-category
	| {
			iconId: number
			type: CategoryType
			id: string
			subId: string
			name: string
			subCategories: null
			archived: boolean
	  }

export const GetCategoryListRequest = z.object({
	type: z.enum(CategoryType),
})
export type GetCategoryListRequest = z.infer<typeof GetCategoryListRequest>
