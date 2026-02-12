import { z } from 'zod'
import { CategoryType } from '@/core/domain'

export const EditCategoryRequest = z.object({
	type: z.enum(CategoryType),
	id: z.uuid(),
	subId: z.uuid().optional(),
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.transform(v => v.trim().toLowerCase())
		.optional(),
	iconId: z.number().optional(),
})
export type EditCategoryRequest = z.infer<typeof EditCategoryRequest>
