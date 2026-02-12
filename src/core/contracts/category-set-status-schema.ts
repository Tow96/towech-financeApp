import { z } from 'zod'
import { CategoryType } from '@/core/entities'

export const SetCategoryStatusSchema = z.object({
	type: z.enum(CategoryType),
	id: z.uuid(),
	subId: z.uuid().optional(),
	archived: z.boolean(),
})
export type SetCategoryStatusSchema = z.infer<typeof SetCategoryStatusSchema>
