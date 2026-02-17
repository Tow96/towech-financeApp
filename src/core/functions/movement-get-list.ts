import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetMovementListRequest } from '@/core/dto'

import { MovementRepository } from '@/database/repositories'

export const getMovementList = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetMovementListRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const movementRepo = new MovementRepository()
		logger.info(
			`user: ${userId} requesting movements for ${data.periodStart.getFullYear()}-${data.periodStart.getMonth() + 1}`,
		)

		const walletId = data.walletId === 'total' ? undefined : data.walletId
		return await movementRepo.queryGetMovementList(userId, data.periodStart, walletId)
	})
