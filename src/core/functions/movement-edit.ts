import { and, eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { MovementDetailDto } from '@/core/dto'

import { EditMovementRequest } from '@/core/dto'
import { CategoryType } from '@/core/domain'
import { convertAmountToCents } from '@/core/utils'

import { db, schema } from '@/database/utils'

export const editMovement = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(EditMovementRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		// Checks movement exists
		const existingMovement = await db.query.Movements.findMany({
			with: { summary: true },
			where: eq(schema.Movements.id, data.id),
		})

		logger.info(data)

		if (existingMovement.length === 0) throw new Response('Movement not found', { status: 404 })
		if (existingMovement[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

		logger.info(`User: ${userId} trying to edit movement: ${data.id}`)

		// Category validation
		let category = {
			type: existingMovement[0].categoryType as CategoryType,
			id: existingMovement[0].categoryId,
			subId: existingMovement[0].categorySubId,
		}
		if (data.category) {
			if (data.category.id !== null) {
				const existingCategory = await db
					.select({ id: schema.Categories.id, userId: schema.Categories.userId })
					.from(schema.Categories)
					.where(
						and(eq(schema.Categories.userId, userId), eq(schema.Categories.id, data.category.id)),
					)

				if (existingCategory.length === 0) throw new Response('Category not found', { status: 404 })

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
						throw new Response('Subcategory not found', { status: 404 })
				}
			}

			category = data.category
		}

		// Wallet validation
		const wallet = {
			originId: existingMovement[0].summary[0].originWalletId,
			destinationId: existingMovement[0].summary[0].destinationWalletId,
		}
		if (data.wallet && (data.wallet.originId || data.wallet.destinationId)) {
			if (data.wallet.originId) {
				const existingOriginWallet = await db
					.select({ id: schema.Wallets.id })
					.from(schema.Wallets)
					.where(
						and(eq(schema.Wallets.id, data.wallet.originId), eq(schema.Wallets.userId, userId)),
					)

				if (existingOriginWallet.length === 0)
					throw new Response('Origin wallet not found', { status: 404 })
			}

			if (data.wallet.destinationId) {
				const existingDestinationWallet = await db
					.select({ id: schema.Wallets.id })
					.from(schema.Wallets)
					.where(
						and(
							eq(schema.Wallets.id, data.wallet.destinationId),
							eq(schema.Wallets.userId, userId),
						),
					)

				if (existingDestinationWallet.length === 0)
					throw new Response('Destination wallet not found', { status: 404 })
			}

			wallet.originId = data.wallet.originId ?? null
			wallet.destinationId = data.wallet.destinationId ?? null
		}

		logger.info(existingMovement[0].summary[0])
		logger.info(wallet)

		// Revalidate category/wallet relation
		if (category.type === CategoryType.transfer && wallet.originId === wallet.destinationId)
			throw new Response('Destination wallet must be different from origin wallet', { status: 421 })
		if (category.type !== CategoryType.income && wallet.originId === null)
			throw new Response('Origin wallet is required', { status: 421 })
		if (category.type !== CategoryType.expense && wallet.destinationId === null)
			throw new Response('Destination wallet is required', { status: 421 })

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
				originWalletId: wallet.originId,
				destinationWalletId: wallet.destinationId,
			})
		})

		const output: MovementDetailDto = {
			id: data.id,
			amount,
			date: data.date ? new Date(data.date) : existingMovement[0].date,
			description: data.description ? data.description : existingMovement[0].description,
			category,
			wallet: {
				originId: wallet.originId,
				destinationId: wallet.destinationId,
			},
		}
		return output
	})
