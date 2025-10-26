import { z } from 'zod'

export const RestoreCategorySchema = z.object({
	id: z.uuid(),
})
export type RestoreCategorySchema = z.infer<typeof RestoreCategorySchema>
