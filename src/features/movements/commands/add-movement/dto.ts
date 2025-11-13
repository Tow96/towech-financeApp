import { z } from 'zod'

import { CategoryType } from '@/features/categories/domain'

export const AddMovementSchema = z
	.object({
		date: z.date(),
		description: z
			.string()
			.min(1)
			.max(140)
			.transform(v => v.trim()),
		category: z.object({
			type: z.enum(CategoryType),
			id: z.uuid().nullable(),
			subId: z.uuid().nullable(),
		}),
		amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a number with up to two decimal places'),
		wallet: z.object({
			originId: z.uuid().optional(),
			destinationId: z.uuid().optional(),
		}),
	})
	.superRefine((data, ctx) => {
		if (data.category.type === CategoryType.transfer && data.wallet.originId === data.wallet.destinationId)
			ctx.addIssue({ code: 'custom', path: ['wallet', 'destinationId'], message: 'Destination wallet must be different from origin wallet.'})

		if (data.category.type !== CategoryType.income && data.wallet.originId === undefined)
			ctx.addIssue({ code: 'custom', path: ['wallet', 'originId'], message: 'Origin wallet is required' })

		if (data.category.type !== CategoryType.expense && data.wallet.destinationId === undefined)
			ctx.addIssue({ code: 'custom', path: ['wallet', 'destinationId'], message: 'Destination wallet is required' })
	})


export type AddMovementSchema = z.infer<typeof AddMovementSchema>
