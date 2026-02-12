import { z } from 'zod'
import { CategoryType } from '@/core/domain'

export const EditMovementSchema = z.object({
	id: z.uuid(),
	date: z.date().optional(),
	description: z
		.string()
		.min(1)
		.max(140)
		.transform(v => v.trim())
		.optional(),
	category: z
		.object({
			type: z.enum(CategoryType),
			id: z.uuid().nullable(),
			subId: z.uuid().nullable(),
		})
		.optional(),
	amount: z
		.string()
		.regex(
			/^(?:\d{1,3}(?:,\d{3})*(?:\.\d{0,2})?|\.\d{1,2})$/,
			'Must be a number with up to two decimal places',
		)
		.optional(),
	wallet: z
		.object({
			originId: z.uuid().optional(),
			destinationId: z.uuid().optional(),
		})
		.optional(),
})

export type EditMovementSchema = z.infer<typeof EditMovementSchema>
