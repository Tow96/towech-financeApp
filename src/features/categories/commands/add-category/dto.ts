import { z } from 'zod'
import { CategoryType } from '@/features/categories/domain'

export type CategoryDetailDto = {
	iconId: number
	type: CategoryType
	id: string
	subId: string | null
	name: string
	archived: boolean
}

export const AddCategorySchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.transform(v => v.trim().toLowerCase()),
	type: z.enum(CategoryType),
	iconId: z.number(),
})
export type AddCategorySchema = z.infer<typeof AddCategorySchema>
