import { z } from 'zod'
import { CategoryType } from '@/core/domain'

export const SetCategoryStatusRequest = z.object({
	type: z.enum(CategoryType),
	id: z.uuid(),
	subId: z.uuid().optional(),
	archived: z.boolean(),
})
export type SetCategoryStatusRequest = z.infer<typeof SetCategoryStatusRequest>
