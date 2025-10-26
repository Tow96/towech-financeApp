import { z } from 'zod'

export const ArchiveCategorySchema = z.object({
	id: z.uuid(),
})
export type ArchiveCategorySchema = z.infer<typeof ArchiveCategorySchema>
