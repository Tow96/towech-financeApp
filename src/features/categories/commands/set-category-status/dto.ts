import { z } from 'zod'

export const SetCategoryStatusSchema = z.object({
	id: z.uuid(),
	archived: z.boolean(),
})
export type SetCategoryStatusSchema = z.infer<typeof SetCategoryStatusSchema>