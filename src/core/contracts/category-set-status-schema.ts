import { z } from 'zod'

export const SetCategoryStatusSchema = z.object({
	id: z.uuid(),
	subId: z.uuid().optional(),
	archived: z.boolean(),
})
export type SetCategoryStatusSchema = z.infer<typeof SetCategoryStatusSchema>
