import { z } from 'zod'
import { CategoryType } from '@/core/domain'

export const AddCategoryRequest = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.transform(v => v.trim().toLowerCase()),
	type: z.enum(CategoryType),
	iconId: z.number(),
	id: z.uuid().optional(), // Used for subcategories
})
export type AddCategoryRequest = z.infer<typeof AddCategoryRequest>
