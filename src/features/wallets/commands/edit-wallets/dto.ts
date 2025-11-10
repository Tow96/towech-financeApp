import { z } from 'zod'

export const EditWalletSchema = z.object({
	id: z.uuid(),
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.transform(v => v.trim().toLowerCase())
		.optional(),
	iconId: z.number().optional(),
})
export type EditWalletSchema = z.infer<typeof EditWalletSchema>
