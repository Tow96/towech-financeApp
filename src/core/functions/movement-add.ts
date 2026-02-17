import { v4 as uuidV4 } from 'uuid'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { Movement } from '@/core/domain'

import { AddMovementRequest, mapEntityToMovementDetailDto } from '@/core/dto'
import { convertAmountToCents } from '@/core/utils'

import { CategoryRepository, MovementRepository, WalletRepository } from '@/database/repositories'

export const addMovement = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(AddMovementRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const categoryRepo = new CategoryRepository()
		const movementRepo = new MovementRepository()
		const walletRepo = new WalletRepository()

		logger.info(`User: ${userId} trying to add a new movement`)

		// Category validation
		if (data.category.id !== null) {
			const { type, id, subId } = data.category
			const category = await categoryRepo.get(type, id, subId)

			if (!category || category.userId !== userId)
				throw new Response('Category not found', { status: 404 })
		}

		// Origin wallet validation
		if (data.wallet.originId) {
			const wallet = await walletRepo.get(data.wallet.originId)
			if (!wallet || wallet.userId !== userId)
				throw new Response('Origin wallet not found', { status: 404 })
		}

		// Destination wallet validation
		if (data.wallet.destinationId) {
			const wallet = await walletRepo.get(data.wallet.destinationId)
			if (!wallet || wallet.userId !== userId)
				throw new Response('Destination wallet not found', { status: 404 })
		}

		const newMovement: Movement = {
			userId: userId,
			id: uuidV4(),
			date: data.date,
			amount: convertAmountToCents(data.amount),
			description: data.description,
			category: data.category,
			wallet: {
				originId: data.wallet.originId ?? null,
				destinationId: data.wallet.destinationId ?? null,
			},
		}

		await movementRepo.insert(newMovement)

		return mapEntityToMovementDetailDto(newMovement)
	})
