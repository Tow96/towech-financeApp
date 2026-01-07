import { and, eq, or } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { EditMovementSchema } from './dto'
import type { MovementDetailDto } from '@/features/movements/queries/detail-movement/dto'

import { convertAmountToCents } from '@/common/lib/utils'

import { CategoryType } from '@/features/categories/domain'
import { AuthorizationMiddleware } from '@/features/sessions/validate'

import { db, schema } from '@/database'

export const editMovement = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(EditMovementSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		// Checks movement exists
		const existingMovement = await db.query.Movements.findMany({
			with: { summary: true },
			where: eq(schema.Movements.id, data.id),
		})

		if (existingMovement.length === 0) throw new Response('Movement not found', { status: 404 })
		if (existingMovement[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

		logger.info(`User: ${userId} trying to edit movement: ${data.id}`)

		// Validate category
		const category = data.category
			? data.category
			: {
					type: existingMovement[0].categoryType as CategoryType,
					id: existingMovement[0].categoryId,
					subId: existingMovement[0].categorySubId,
				}
		if (data.category && data.category.id !== null) {
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

		// Validate wallets
		if (data.wallet) {
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
		}
		const originWalletId = data.wallet?.originId
			? category.type !== CategoryType.income
				? (data.wallet.originId ?? null)
				: null
			: existingMovement[0].summary[0].originWalletId
		const destinationWalletId = data.wallet?.destinationId
			? category.type !== CategoryType.expense
				? (data.wallet.destinationId ?? null)
				: null
			: existingMovement[0].summary[0].destinationWalletId

		const amount = data.amount
			? convertAmountToCents(data.amount)
			: existingMovement[0].summary[0].amount

		await db.transaction(async tx => {
			await tx.delete(schema.MovementSummary).where(eq(schema.MovementSummary.movementId, data.id))
			await tx
				.update(schema.Movements)
				.set({
					date: data.date ? new Date(data.date) : existingMovement[0].date,
					description: data.description ?? existingMovement[0].description,
					categoryType: category.type,
					categoryId: category.id,
					categorySubId: category.subId,
					updatedAt: new Date(),
				})
				.where(eq(schema.Movements.id, data.id))
			await tx.insert(schema.MovementSummary).values({
				movementId: data.id,
				amount,
				originWalletId,
				destinationWalletId,
			})
		})

		const output: MovementDetailDto = {
			id: data.id,
			amount,
			date: data.date ? new Date(data.date) : existingMovement[0].date,
			description: data.description ? data.description : existingMovement[0].description,
			category,
			wallet: {
				originId: originWalletId,
				destinationId: destinationWalletId,
			},
		}
		return output
	})
