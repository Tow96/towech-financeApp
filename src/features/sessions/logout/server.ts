import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from '@/features/sessions/validate'
import { deleteSessionCookie, deleteSssionFromDb } from '@/features/sessions/common'

export const logoutSession = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.handler(async ({ context: { userId, logger, sessionId } }) => {
		logger.info(`$User ${userId} signing out`)

		deleteSessionCookie()
		await deleteSssionFromDb(sessionId)
	})
