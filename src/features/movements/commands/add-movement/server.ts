import { and, eq, or } from 'drizzle-orm'
import { v4 as uuidV4 } from 'uuid'
import { createServerFn } from '@tanstack/react-start'

import { AddMovementSchema } from './dto'
import type { MovementDetailDto } from '@/features/movements/queries/detail-movement/dto'

import { convertAmountToCents } from '@/common/lib/utils'

import { CategoryType } from '@/features/categories/domain'
import { AuthorizationMiddleware } from '@/features/sessions/validate'

import { db, schema } from '@/database'

export const addMovement = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(AddMovementSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		// Category validation
		if (data.category.id !== null) {
			const existingCategory = await db
				.select({ id: schema.Categories.id, userId: schema.Categories.userId })
				.from(schema.Categories)
				.where(eq(schema.Categories.id, data.category.id))

			if (existingCategory.length === 0) throw new Response('Category not found', { status: 404 })
			if (existingCategory[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

			if (data.category.subId !== null) {
				const existingSubCategory = await db
					.select({ id: schema.SubCategories.id })
					.from(schema.SubCategories)
					.where(
						and(
							eq(schema.SubCategories.parentId, data.category.id),
							eq(schema.SubCategories.id, data.category.subId),
						),
					)

				if (existingSubCategory.length === 0)
					throw new Response('SubCategory not found', { status: 404 })
			}
		}

		// Wallet validation
		const existingWallets = await db
			.select({ id: schema.Wallets.id, userId: schema.Wallets.userId })
			.from(schema.Wallets)
			.where(
				and(
					or(
						data.wallet.originId ? eq(schema.Wallets.id, data.wallet.originId) : undefined,
						data.wallet.destinationId
							? eq(schema.Wallets.id, data.wallet.destinationId)
							: undefined,
					),
					eq(schema.Wallets.userId, userId),
				),
			)
		if (existingWallets.length === 0) throw new Response('Wallets not found', { status: 404 })

		logger.info(`User: ${userId} trying to add a new movement`)

		const newId = uuidV4()
		await db.transaction(async tx => {
			await tx.insert(schema.Movements).values({
				id: newId,
				userId,
				categoryType: data.category.type,
				categoryId: data.category.id,
				categorySubId: data.category.subId,
				description: data.description,
				date: new Date(data.date),
				createdAt: new Date(),
				updatedAt: new Date(0),
			})

			await tx.insert(schema.MovementSummary).values({
				movementId: newId,
				amount: convertAmountToCents(data.amount),
				originWalletId:
					data.category.type !== CategoryType.income ? (data.wallet.originId ?? null) : null,
				destinationWalletId:
					data.category.type !== CategoryType.expense ? (data.wallet.destinationId ?? null) : null,
			})
		})

		const output: MovementDetailDto = {
			id: newId,
			amount: convertAmountToCents(data.amount),
			date: new Date(data.date),
			description: data.description,
			category: {
				type: data.category.type as CategoryType,
				id: data.category.id,
				subId: data.category.subId,
			},
			wallet: {
				originId:
					data.category.type !== CategoryType.income ? (data.wallet.originId ?? null) : null,
				destinationId:
					data.category.type !== CategoryType.expense ? (data.wallet.destinationId ?? null) : null,
			},
		}
		return output
	})
