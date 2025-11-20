import { z } from 'zod'
import { CategoryType } from '@/features/categories/domain'

export const EditMovementSchema = z
	.object({
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
			.regex(/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/, 'Must be a number with up to two decimal places')
			.optional(),
		wallet: z
			.object({
				originId: z.uuid().optional(),
				destinationId: z.uuid().optional(),
			})
			.optional(),
	})
	.superRefine((data, ctx) => {
		if (data.category && data.wallet) {
			if (
				data.category.type === CategoryType.transfer &&
				data.wallet.originId === data.wallet.destinationId
			)
				ctx.addIssue({
					code: 'custom',
					path: ['wallet', 'destinationId'],
					message: 'Destination wallet must be different from origin wallet.',
				})

			if (data.category.type !== CategoryType.income && data.wallet.originId === undefined)
				ctx.addIssue({
					code: 'custom',
					path: ['wallet', 'originId'],
					message: 'Origin wallet is required',
				})

			if (data.category.type !== CategoryType.expense && data.wallet.destinationId === undefined)
				ctx.addIssue({
					code: 'custom',
					path: ['wallet', 'destinationId'],
					message: 'Destination wallet is required',
				})
		}
	})

export type EditMovementSchema = z.infer<typeof EditMovementSchema>
