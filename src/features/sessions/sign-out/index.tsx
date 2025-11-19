import { useMutation } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

import { deleteSessionCookie, deleteSessionFromDb } from '@/features/sessions/common'
import { AuthorizationMiddleware } from '@/features/sessions/validate'

export const useSignOutMutation = () => {
	return useMutation({
		mutationFn: () => signOutSession(),
	})
}

export const signOutSession = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.handler(async ({ context: { logger, userId, sessionId } }) => {
		logger.info(`User ${userId} signing out`)

		await deleteSessionFromDb(sessionId)
		deleteSessionCookie()
	})
