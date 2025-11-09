import { z } from 'zod'

export const SetWalletStatusSchema = z.object({
	id: z.uuid(),
	archived: z.boolean(),
})
export type SetWalletStatusSchema = z.infer<typeof SetWalletStatusSchema>
