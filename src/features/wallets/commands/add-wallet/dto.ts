import { z } from 'zod'

export const AddWalletSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.transform(v => v.trim().toLowerCase()),
	iconId: z.number(),
})
export type AddWalletSchema = z.infer<typeof AddWalletSchema>
