import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { Movement } from '@/core/domain'

import { EditMovementRequest, mapEntityToMovementDetailDto } from '@/core/dto'
import { CategoryType } from '@/core/domain'
import { convertAmountToCents } from '@/core/utils'

import { CategoryRepository, MovementRepository, WalletRepository } from '@/database/repositories'

export const editMovement = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(EditMovementRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const categoryRepo = new CategoryRepository()
		const movementRepo = new MovementRepository()
		const walletRepo = new WalletRepository()

		logger.info(`User: ${userId} trying to edit movement: ${data.id}`)

		// Checks movement exists
		const movement = await movementRepo.get(data.id)
		if (!movement || movement.userId !== userId)
			throw new Response('Movement not found', { status: 404 })

		// Since updating requires some validation, first it will be declared here
		const updatedMovement: Movement = {
			...movement,
			date: data.date ?? movement.date,
			amount: data.amount ? convertAmountToCents(data.amount) : movement.amount,
			description: data.description ?? movement.description,
		}

		// Category validation
		if (data.category) {
			if (data.category.id !== null) {
				const { type, id, subId } = data.category
				const category = await categoryRepo.get(type, id, subId)

				if (!category || category.userId !== userId)
					throw new Response('Category not found', { status: 404 })
			}
			updatedMovement.category = data.category
		}

		// Wallet validation
		if (data.wallet) {
			if (data.wallet.originId) {
				const originWallet = await walletRepo.get(data.wallet.originId)
				if (!originWallet || originWallet.userId !== userId)
					throw new Response('Origin wallet not found', { status: 404 })
			}
			if (data.wallet.destinationId) {
				const destinationWallet = await walletRepo.get(data.wallet.destinationId)
				if (!destinationWallet || destinationWallet.userId !== userId)
					throw new Response('Destination wallet not found', { status: 404 })
			}

			updatedMovement.wallet = {
				originId: data.wallet.originId ?? null,
				destinationId: data.wallet.destinationId ?? null,
			}
		}

		// Revalidate category/wallet relation
		if (
			updatedMovement.category.type === CategoryType.transfer &&
			updatedMovement.wallet.originId === updatedMovement.wallet.destinationId
		)
			throw new Response('Destination wallet must be different from origin wallet', { status: 421 })

		if (
			updatedMovement.category.type !== CategoryType.income &&
			updatedMovement.wallet.originId === null
		)
			throw new Response('Origin wallet is required', { status: 421 })

		if (
			updatedMovement.category.type !== CategoryType.expense &&
			updatedMovement.wallet.destinationId === null
		)
			throw new Response('Destination wallet is required', { status: 421 })

		await movementRepo.update(updatedMovement)

		return mapEntityToMovementDetailDto(updatedMovement)
	})
