import { z } from 'zod'

import type { Movement } from '@/core/domain'
import { CategoryType } from '@/core/domain'

// TODO: Refine zod requests
// Add ------------------------------------------------------------------------
export const AddMovementRequest = z
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
		amount: z
			.string()
			.regex(
				/^(?:[\d,]*(?:\.\d{0,2})?|(?:\.\d{0,2}))$/,
				'Must be a number with up to two decimal places',
			)
			.transform(v => v.trim().replaceAll(',', '')),
		wallet: z.object({
			originId: z.uuid().optional(),
			destinationId: z.uuid().optional(),
		}),
	})
	.superRefine((data, ctx) => {
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
	})
export type AddMovementRequest = z.infer<typeof AddMovementRequest>

// Detail ---------------------------------------------------------------------
export type MovementDetailDto = {
	id: string
	amount: number
	date: Date
	description: string
	category: {
		type: CategoryType
		id: string | null
		subId: string | null
	}
	wallet: {
		originId: string | null
		destinationId: string | null
	}
}

export const mapEntityToMovementDetailDto = (movement: Movement): MovementDetailDto => ({
	id: movement.id,
	date: movement.date,
	amount: movement.amount,
	description: movement.description,
	category: movement.category,
	wallet: movement.wallet,
})

export const GetMovementDetailRequest = z.object({
	id: z.uuid(),
})
export type GetMovementDetailRequest = z.infer<typeof GetMovementDetailRequest>

// List -----------------------------------------------------------------------
export type ListMovementItemDto = {
	id: string
	date: Date
	description: string
	amount: number

	category: {
		type: CategoryType
		id: string | null
		subId: string | null
	}
	wallet: {
		originId: string | null
		destinationId: string | null
	}
}
export const GetMovementListRequest = z.object({
	walletId: z.string().optional(),
	periodStart: z.date(),
})
export type GetMovementListRequest = z.infer<typeof GetMovementListRequest>

// Edit -----------------------------------------------------------------------
export const EditMovementRequest = z.object({
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
export type EditMovementRequest = z.infer<typeof EditMovementRequest>

// Delete ---------------------------------------------------------------------
export const DeleteMovementRequest = z.object({
	id: z.uuid(),
})
export type DeleteMovementRequest = z.infer<typeof DeleteMovementRequest>

