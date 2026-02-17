import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { DeleteMovementRequest } from '@/core/dto'

import { MovementRepository } from '@/database/repositories'

export const deleteMovement = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(DeleteMovementRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const movementRepo = new MovementRepository()

		logger.info(`User: ${userId} trying to remove movement: ${data.id}`)

		const movement = await movementRepo.get(data.id)
		if (!movement || movement.userId !== userId)
			throw new Response('Movement not found', { status: 404 })

		await movementRepo.delete(data.id)
	})
