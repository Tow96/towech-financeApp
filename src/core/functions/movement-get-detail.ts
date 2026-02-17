import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetMovementDetailRequest, mapEntityToMovementDetailDto } from '@/core/dto'

import { MovementRepository } from '@/database/repositories'

export const getMovementDetail = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetMovementDetailRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const movementRepo = new MovementRepository()

		logger.info(`User ${userId} requesting detail for movement ${data.id}`)

		const movement = await movementRepo.get(data.id)
		if (!movement || movement.userId !== userId)
			throw new Response('Movement not found', { status: 404 })

		return mapEntityToMovementDetailDto(movement)
	})
