import { z } from 'zod'

export const DeleteMovementSchema = z.object({
	id: z.uuid(),
})
export type DeleteMovementSchema = z.infer<typeof DeleteMovementSchema>
