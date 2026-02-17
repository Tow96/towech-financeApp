import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { MovementRepository } from '@/database/repositories'

export const getRecentMovementList = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.handler(async ({ context: { userId, logger } }) => {
		const movementRepo = new MovementRepository()
		logger.info(`Fetching recent movements for user: ${userId}`)

		return await movementRepo.queryGetRecentMovements(userId, 10)
	})
